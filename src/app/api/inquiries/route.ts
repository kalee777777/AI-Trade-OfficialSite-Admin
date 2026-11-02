import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { inquiries } from '@/db/schema';

/**
 * 询盘提交接口（POST /api/inquiries）—— P2 起落库（本地 SQLite / Turso 双模式）。
 * - 防垃圾：honeypot 字段 + 提交耗时检测 + 每 IP 限流（内存窗口）
 * - 配套：GET /api/sync/inquiries（P3）供 AI-Trade-Workbench 持 Key 拉取，
 *   契约见 docs/CONTRACT-inquiry-sync.md。
 */
export const dynamic = 'force-dynamic';

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

async function makeId(): Promise<string> {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const rows = await db.select({ c: sql<number>`count(*)` }).from(inquiries);
  return `INQ-${ymd}-${String(Number(rows[0]?.c ?? 0) + 1).padStart(4, '0')}`;
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

  const record = {
    id: await makeId(),
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

  try {
    await ensureDb();
    await db.insert(inquiries).values(record);
  } catch (err) {
    console.error('[inquiries] persist failed:', err);
    return NextResponse.json({ ok: false, error: 'Storage error, please try again later.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: record.id });
}
