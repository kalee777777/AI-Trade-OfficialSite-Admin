import Link from 'next/link';
import { desc, eq, sql } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { inquiries, products, news, cases } from '@/db/schema';
import { isDefaultPassword } from '@/lib/actions/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const STATUS_LABEL: Record<string, string> = {
  new: '新询盘', processing: '处理中', replied: '已回复', won: '已成交', spam: '垃圾',
};

/** 仪表盘：核心指标 + 最近询盘 + 默认密码警告。 */
export default async function AdminDashboard() {
  await ensureDb();
  const [productRows, newsRows, caseRows, inquiryRows, newInquiryRows, recent, defaultPw] = await Promise.all([
    db.select({ c: sql<number>`count(*)` }).from(products),
    db.select({ c: sql<number>`count(*)` }).from(news),
    db.select({ c: sql<number>`count(*)` }).from(cases),
    db.select({ c: sql<number>`count(*)` }).from(inquiries),
    db.select({ c: sql<number>`count(*)` }).from(inquiries).where(eq(inquiries.status, 'new')),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(8),
    isDefaultPassword(),
  ]);

  const stats = [
    { label: '产品数', value: Number(productRows[0]?.c ?? 0), href: '/admin/products' },
    { label: '询盘总数', value: Number(inquiryRows[0]?.c ?? 0), href: '/admin/inquiries' },
    { label: '新询盘', value: Number(newInquiryRows[0]?.c ?? 0), href: '/admin/inquiries?status=new' },
    { label: '新闻数', value: Number(newsRows[0]?.c ?? 0), href: '/admin/news' },
    { label: '案例数', value: Number(caseRows[0]?.c ?? 0), href: '/admin/cases' },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">仪表盘</h1>
        <div className="flex gap-2">
          <Button asChild size="sm"><Link href="/admin/products/new">+ 新增产品</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/admin/inquiries">询盘管理</Link></Button>
        </div>
      </div>

      {defaultPw && (
        <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          ⚠️ 当前仍在使用默认密码 <code>admin123</code>。请立即到 <Link href="/admin/settings" className="font-bold underline">站点设置 → 修改密码</Link> 修改。
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-brand">{s.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">最近询盘</h2>
          <Link href="/admin/inquiries" className="text-xs font-semibold text-brand hover:underline">查看全部 →</Link>
        </div>
        <div className="card overflow-x-auto">
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              暂无询盘。去前台 <Link href="/inquiry" className="text-brand hover:underline">询盘页</Link> 提交一条试试。
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-accent">编号</TableHead>
                  <TableHead className="bg-accent">客户</TableHead>
                  <TableHead className="bg-accent">产品</TableHead>
                  <TableHead className="bg-accent">时间</TableHead>
                  <TableHead className="bg-accent">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.id}</TableCell>
                    <TableCell>
                      <span className="font-medium text-ink">{row.name}</span>
                      <span className="block text-xs text-muted-foreground">{row.email}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.product || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.createdAt.slice(0, 16).replace('T', ' ')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'new' ? 'brand' : 'secondary'}>
                        {STATUS_LABEL[row.status] ?? row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}
