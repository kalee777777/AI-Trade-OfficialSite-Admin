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

async function init(): Promise<void> {
  const c = getClient();
  for (const stmt of DDL_STATEMENTS) {
    await c.execute(stmt);
  }

  // 已初始化过（settings 里有 site 行）则跳过种子
  const existing = await c.execute("SELECT key FROM settings WHERE key = 'site'");
  if (existing.rows.length > 0) return;

  const seed = seedJson as Record<string, unknown>;
  const now = new Date().toISOString();

  await c.execute({
    sql: 'INSERT INTO settings (key, value) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)',
    args: [
      'site', JSON.stringify(seed.settings ?? {}),
      'navigation', JSON.stringify(seed.navigation ?? []),
      'home', JSON.stringify({ trustStats: seed.trustStats ?? [], advantages: seed.advantages ?? [] }),
      'about', JSON.stringify(seed.about ?? {}),
      'admin_password', JSON.stringify({
        hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
      }),
    ],
  });

  const cats = (seed.categories ?? []) as { id: string; slug: string; name: string; description: string }[];
  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO categories (id, slug, name, description, sort) VALUES (?, ?, ?, ?, ?)',
      args: [cat.id, cat.slug, cat.name, cat.description, i],
    });
  }

  const products = (seed.products ?? []) as Record<string, unknown>[];
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

  const banners = (seed.banners ?? []) as Record<string, unknown>[];
  for (let i = 0; i < banners.length; i++) {
    const b = banners[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO banners (id, title, subtitle, cta_text, cta_href, image, sort) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [String(b.id), String(b.title), String(b.subtitle ?? ''), String(b.ctaText ?? ''), String(b.ctaHref ?? ''), String(b.image ?? ''), i],
    });
  }

  const cases = (seed.cases ?? []) as Record<string, unknown>[];
  for (let i = 0; i < cases.length; i++) {
    const cs = cases[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO cases (slug, title, summary, content, date, image, products, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [String(cs.slug), String(cs.title), String(cs.summary ?? ''), JSON.stringify(cs.content ?? []), String(cs.date ?? now.slice(0, 10)), String(cs.image ?? ''), JSON.stringify(cs.products ?? []), i],
    });
  }

  const news = (seed.news ?? []) as Record<string, unknown>[];
  for (let i = 0; i < news.length; i++) {
    const n = news[i];
    await c.execute({
      sql: 'INSERT OR IGNORE INTO news (slug, title, summary, content, date, sort) VALUES (?, ?, ?, ?, ?, ?)',
      args: [String(n.slug), String(n.title), String(n.summary ?? ''), JSON.stringify(n.content ?? []), String(n.date ?? now.slice(0, 10)), i],
    });
  }
}
