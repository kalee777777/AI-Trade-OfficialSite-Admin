import { desc } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { inquiries } from '@/db/schema';
import { getSession } from '@/lib/session';

/** 询盘 CSV 导出（Excel 友好：UTF-8 BOM + 全部字段）。 */
export async function GET() {
  const session = await getSession();
  if (!session.isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }
  await ensureDb();
  const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));

  const header = ['ID', '时间', '姓名', '邮箱', '公司', '国家', '电话', '产品', '留言', '来源', '页面', '状态'];
  const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [
    header.join(','),
    ...rows.map((r) =>
      [r.id, r.createdAt, r.name, r.email, r.company, r.country, r.phone, r.product, r.message, r.source, r.pageUrl, r.status]
        .map(escape)
        .join(','),
    ),
  ].join('\n');

  return new Response('\ufeff' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
