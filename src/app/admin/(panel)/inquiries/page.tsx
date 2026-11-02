import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { inquiries as inquiriesTable } from '@/db/schema';
import {
  updateInquiryStatusAction, deleteInquiryAction,
  createApiKeyAction, revokeApiKeyAction, listApiKeysForAdmin,
} from '@/lib/actions/crud';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const STATUS_OPTIONS = [
  { value: 'new', label: '新询盘' },
  { value: 'processing', label: '处理中' },
  { value: 'replied', label: '已回复' },
  { value: 'won', label: '已成交' },
  { value: 'spam', label: '垃圾' },
];
const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s.label]));

/** 询盘管理：筛选 / 状态流转 / 删除 / CSV 导出 + API Key（给 AI-Trade-Workbench 同步用）。 */
export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string; key?: string };
}) {
  await ensureDb();
  const status = searchParams.status && STATUS_OPTIONS.some((s) => s.value === searchParams.status)
    ? searchParams.status
    : undefined;
  const rows = status
    ? await db.select().from(inquiriesTable).where(eq(inquiriesTable.status, status)).orderBy(desc(inquiriesTable.createdAt))
    : await db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.createdAt));
  const keys = await listApiKeysForAdmin();
  const back = status ? `/admin/inquiries?status=${status}` : '/admin/inquiries';

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">询盘管理</h1>
        <Button asChild size="sm" variant="outline">
          <a href="/admin/api/export">⬇ 导出 CSV</a>
        </Button>
      </div>

      {/* 状态筛选 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/inquiries"
          className={'rounded-md border px-3 py-1.5 text-xs font-semibold ' + (status ? 'border-line text-muted-foreground' : 'border-brand bg-brand text-white')}
        >
          全部
        </Link>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s.value}
            href={`/admin/inquiries?status=${s.value}`}
            className={'rounded-md border px-3 py-1.5 text-xs font-semibold ' + (status === s.value ? 'border-brand bg-brand text-white' : 'border-line text-muted-foreground')}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* 新 Key 一次性展示 */}
      {searchParams.key && (
        <div className="mb-4 rounded-md border border-brand/40 bg-accent p-4 text-sm">
          <p className="font-bold text-accent-foreground">新 API Key 已创建（仅此一次完整显示，请立即复制到工作台）：</p>
          <code className="mt-2 block break-all rounded bg-paper px-3 py-2 font-mono text-xs text-brand">{searchParams.key}</code>
        </div>
      )}

      <div className="card overflow-x-auto">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">暂无询盘</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-accent">编号 / 时间</TableHead>
                <TableHead className="bg-accent">客户</TableHead>
                <TableHead className="bg-accent">内容</TableHead>
                <TableHead className="bg-accent">状态</TableHead>
                <TableHead className="bg-accent text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap">
                    <p className="font-mono text-xs text-ink">{row.id}</p>
                    <p className="text-xs text-muted-foreground">{row.createdAt.slice(0, 16).replace('T', ' ')}</p>
                    <p className="text-[10px] text-muted-foreground">{row.source}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-ink">{row.name} {row.country && <span className="text-xs text-muted-foreground">· {row.country}</span>}</p>
                    <p className="text-xs text-brand">{row.email}</p>
                    {row.phone && <p className="text-xs text-muted-foreground">{row.phone}</p>}
                    {row.company && <p className="text-xs text-muted-foreground">{row.company}</p>}
                  </TableCell>
                  <TableCell className="max-w-sm">
                    {row.product && <Badge variant="brand" className="mb-1">{row.product}</Badge>}
                    <p className="line-clamp-3 text-xs text-muted-foreground">{row.message}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'new' ? 'brand' : row.status === 'won' ? 'default' : 'secondary'}>
                      {STATUS_LABEL[row.status] ?? row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-end gap-1">
                      <form action={updateInquiryStatusAction} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="back" value={back} />
                        <select name="status" defaultValue={row.status} className="field h-8 w-24 text-xs">
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <Button type="submit" variant="outline" size="sm" className="h-8">更新</Button>
                      </form>
                      <form action={deleteInquiryAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="back" value={back} />
                        <Button type="submit" variant="ghost" size="sm" className="h-7 text-xs text-destructive">删除</Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* API Keys（P3 同步用） */}
      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">API Keys（同步给 AI-Trade-Workbench）</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          工作台「设置 → 独立站对接」填入站点地址 + Key 即可拉取询盘（契约见 docs/CONTRACT-inquiry-sync.md）。Key 明文只在创建时显示一次。
        </p>
        <div className="mt-3 grid gap-6 md:grid-cols-2">
          <div className="card divide-y divide-line">
            {keys.length === 0 && <p className="p-4 text-sm text-muted-foreground">还没有 Key</p>}
            {keys.map((k) => (
              <div key={k.key} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-ink">{k.key.slice(0, 16)}…{k.key.slice(-4)}</p>
                  <p className="text-xs text-muted-foreground">
                    {k.label} · 创建于 {k.createdAt.slice(0, 10)}
                    {k.lastUsedAt ? ` · 最近同步 ${k.lastUsedAt.slice(0, 16).replace('T', ' ')}` : ' · 未使用'}
                    {k.revoked ? ' · 已吊销' : ''}
                  </p>
                </div>
                {!k.revoked && (
                  <form action={revokeApiKeyAction}>
                    <input type="hidden" name="key" value={k.key} />
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive">吊销</Button>
                  </form>
                )}
              </div>
            ))}
          </div>
          <form action={createApiKeyAction} className="card h-fit space-y-3 p-6">
            <div>
              <Label className="mb-1 block">备注名</Label>
              <Input name="label" placeholder="e.g. my-workbench" />
            </div>
            <Button type="submit" size="sm">＋ 签发新 Key</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
