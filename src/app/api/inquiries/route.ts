import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 询盘提交接口（POST /api/inquiries）
 * - 防垃圾：honeypot 字段 + 提交耗时检测 + 每 IP 限流（内存窗口，P2 换 DB 后跨实例生效）
 * - 持久化：P1 写本地 data/inquiries.local.json（本地/自托管可用）；
 *   Vercel 等无状态文件系统下写入会失败——P2 引入数据库双模式后解决。
 * - 同步：配套 GET /api/sync/inquiries 供 AI-Trade-Workbench 拉取（P3 阶段实现，
 *   契约见 docs/CONTRACT-inquiry-sync.md）。
 */
export const dynamic = 'force-dynamic';

const STORE_FILE = path.join(process.cwd(), 'data', 'inquiries.local.json');
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value: unknown, maxLen: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLen) : '';
}

async function loadStore(): Promise<{ inquiries: Record<string, unknown>[] }> {
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { inquiries: [] };
  }
}

function makeId(existing: number): string {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `INQ-${ymd}-${String(existing + 1).padStart(4, '0')}`;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // 蜜罐命中 / 提交过快 → 对机器人返回成功但静默丢弃
  const honeypot = clean(body.website, 200);
  const elapsedMs = typeof body.elapsedMs === 'number' ? body.elapsedMs : 99_999;
  if (honeypot || elapsedMs < 2000) {
    return NextResponse.json({ ok: true, id: '' });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 3000);
  if (!name || !email || !message || !isEmail(email)) {
    return NextResponse.json({ ok: false, error: 'Please fill in a valid name, email and message.' }, { status: 400 });
  }

  const store = await loadStore();
  const record = {
    id: makeId(store.inquiries.length),
    createdAt: new Date().toISOString(),
    name,
    email,
    company: clean(body.company, 200),
    country: clean(body.country, 100),
    phone: clean(body.phone, 50),
    product: clean(body.product, 200),
    message,
    source: clean(body.source, 50) || 'form',
    pageUrl: clean(body.pageUrl, 500),
    status: 'new',
  };
  store.inquiries.push(record);

  try {
    await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    // Serverless 文件系统只读：询盘本次不落盘（P2 数据库模式解决），不阻塞用户
    console.error('[inquiries] local persist failed:', err);
  }

  return NextResponse.json({ ok: true, id: record.id });
}
