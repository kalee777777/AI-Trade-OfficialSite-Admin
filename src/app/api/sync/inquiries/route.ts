import { NextResponse } from 'next/server';
import { asc, eq, gt } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { inquiries, apiKeys } from '@/db/schema';

/**
 * 询盘同步端点（GET /api/sync/inquiries）——供 AI-Trade-Workbench 拉取。
 * 契约：docs/CONTRACT-inquiry-sync.md v1（两仓库同文，变更需同步升版）。
 *
 * 鉴权：X-Api-Key（Admin 后台「询盘管理 → API Keys」签发，可吊销）
 * 增量：?since=<ISO8601>；翻页：?cursor=<上次返回的 nextCursor>；?limit=1..100（默认 50）
 * 限流：60 次/小时/Key；成功访问回写 last_used_at（Admin 可见）
 */
export const dynamic = 'force-dynamic';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function GET(req: Request) {
  await ensureDb();

  const key = req.headers.get('x-api-key');
  if (!key) {
    return NextResponse.json({ error: 'Missing X-Api-Key header.' }, { status: 401 });
  }

  const keyRows = await db.select().from(apiKeys).where(eq(apiKeys.key, key)).limit(1);
  const apiKey = keyRows[0];
  if (!apiKey || apiKey.revoked) {
    return NextResponse.json({ error: 'Invalid or revoked API key.' }, { status: 403 });
  }

  if (rateLimited(key)) {
    return NextResponse.json({ error: 'Rate limit exceeded (60/hour).' }, { status: 429 });
  }

  await db.update(apiKeys).set({ lastUsedAt: new Date().toISOString() }).where(eq(apiKeys.key, key));

  const url = new URL(req.url);
  const since = url.searchParams.get('cursor') || url.searchParams.get('since') || '';
  let limit = Number(url.searchParams.get('limit')) || 50;
  limit = Math.min(Math.max(Math.floor(limit), 1), 100);

  const rows = await db
    .select({
      id: inquiries.id,
      createdAt: inquiries.createdAt,
      name: inquiries.name,
      email: inquiries.email,
      company: inquiries.company,
      country: inquiries.country,
      phone: inquiries.phone,
      product: inquiries.product,
      message: inquiries.message,
      source: inquiries.source,
      pageUrl: inquiries.pageUrl,
      status: inquiries.status,
    })
    .from(inquiries)
    .where(since ? gt(inquiries.createdAt, since) : undefined)
    .orderBy(asc(inquiries.createdAt))
    .limit(limit);

  const hasMore = rows.length === limit;
  const nextCursor = hasMore ? rows[rows.length - 1].createdAt : null;

  return NextResponse.json({ inquiries: rows, nextCursor, hasMore });
}
