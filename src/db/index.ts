import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import bcrypt from 'bcryptjs';
import seedJson from '../../data/seed.json';
import { DDL_STATEMENTS } from './ddl';
import * as schema from './schema';

/**
 * 双模式数据层（同一套 SQLite 方言代码）：
 * - 本地/自托管：DATABASE_URL 留空 → SQLite 文件 data/site.db（零配置，首次启动自动建库+灌入模板内容）
 * - Vercel 等无状态平台：设置 DATABASE_URL=libsql://… 与 DATABASE_AUTH_TOKEN → Turso 云端
 */

function resolveUrl(): string {
  return process.env.DATABASE_URL || 'file:data/site.db';
}

let client: Client | null = null;
export function getClient(): Client {
  if (!client) {
    client = createClient({
      url: resolveUrl(),
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    });
    if (!process.env.DATABASE_URL && process.env.VERCEL) {
      console.warn('[db] 检测到 Vercel 且未配置 DATABASE_URL：数据将不持久化。请在 Turso 创建免费数据库并配置环境变量（见 README）。');
    }
  }
  return client;
}

export const db = drizzle(getClient(), { schema });

let ready: Promise<void> | null = null;

/** 建表 + 首次灌种子（幂等；进程内只跑一次，所有数据访问前调用，开销可忽略）。 */
export function ensureDb(): Promise<void> {
  if (!ready) {
    ready = init().catch((err) => {
      ready = null; // 失败允许重试
      throw err;
    });
  }
  return ready;
}

/** Demo 站重置：清空全部业务表并按种子全量重灌（Product A–D 模板内容恢复）。 */
export async function reseedDb(): Promise<void> {
  const c = getClient();
  await prepareConnection(c);
  await createTables(c);
  for (const table of ['products', 'categories', 'banners', 'cases', 'news', 'inquiries', 'api_keys', 'settings']) {
    await c.execute(`DELETE FROM ${table}`);
  }
  await seed(c);
}

async function init(): Promise<void> {
  const c = getClient();
  await prepareConnection(c);
  await createTables(c);
  const existing = await c.execute("SELECT key FROM settings WHERE key = 'site'");
  if (existing.rows.length === 0) {
    await seed(c);
  }
}

/** 本地文件模式：WAL + busy_timeout，容忍多进程（如 next build 多 worker）并发初始化。 */
async function prepareConnection(c: Client): Promise<void> {
  if (!resolveUrl().startsWith('file:')) return;
  try {
    await c.execute('PRAGMA journal_mode = WAL');
    await c.execute('PRAGMA busy_timeout = 10000');
  } catch {
    // 容错：PRAGMA 失败不阻塞启动
  }
}

async function createTables(c: Client): Promise<void> {
  for (const stmt of DDL_STATEMENTS) {
    await c.execute(stmt);
  }
}

async function seed(c: Client): Promise<void> {
  const data = seedJson as Record<string, unknown>;
  const now = new Date().toISOString();

  await c.execute({
    // OR IGNORE：多进程冷启动并发灌种子时幂等
    sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)',
    args: [
      'site', JSON.stringify(data.settings ?? {}),
      'navigation', JSON.stringify(data.navigation ?? []),
      'home', JSON.stringify({ trustStats: data.trustStats ?? [], advantages: data.advantages ?? [] }),
      'about', JSON.stringify(data.about ?? {}),
      'admin_password', JSON.stringify({
        hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
      }),
    ],
  });

  const cats = (data.categories ?? []) as { id: string; slug: string; name: string; description: string }[];
  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO categories (id, slug, name, description, sort) VALUES (?, ?, ?, ?, ?)',
      args: [cat.id, cat.slug, cat.name, cat.description, i],
    });
  }

  const products = (data.products ?? []) as Record<string, unknown>[];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await c.execute({
      sql: `INSERT OR IGNORE INTO products
        (id, slug, name, category_slug, tagline, description, image, features, specs, quotable_line, faq, published, sort)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        String(p.id), String(p.slug), String(p.name), String(p.categorySlug),
        String(p.tagline ?? ''), JSON.stringify(p.description ?? []),
        String(p.image ?? ''), JSON.stringify(p.features ?? []),
        JSON.stringify(p.specs ?? []), String(p.quotableLine ?? ''),
        JSON.stringify(p.faq ?? []), p.published === false ? 0 : 1, i,
      ],
    });
  }

  const banners = (data.banners ?? []) as Record<string, unknown>[];
  for (let i = 0; i < banners.length; i++) {
    const b = banners[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO banners (id, title, subtitle, cta_text, cta_href, image, sort) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [String(b.id), String(b.title), String(b.subtitle ?? ''), String(b.ctaText ?? ''), String(b.ctaHref ?? ''), String(b.image ?? ''), i],
    });
  }

  const cases = (data.cases ?? []) as Record<string, unknown>[];
  for (let i = 0; i < cases.length; i++) {
    const cs = cases[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO cases (slug, title, summary, content, date, image, products, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [String(cs.slug), String(cs.title), String(cs.summary ?? ''), JSON.stringify(cs.content ?? []), String(cs.date ?? now.slice(0, 10)), String(cs.image ?? ''), JSON.stringify(cs.products ?? []), i],
    });
  }

  const news = (data.news ?? []) as Record<string, unknown>[];
  for (let i = 0; i < news.length; i++) {
    const n = news[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO news (slug, title, summary, content, date, sort) VALUES (?, ?, ?, ?, ?, ?)',
      args: [String(n.slug), String(n.title), String(n.summary ?? ''), JSON.stringify(n.content ?? []), String(n.date ?? now.slice(0, 10)), i],
    });
  }
}
