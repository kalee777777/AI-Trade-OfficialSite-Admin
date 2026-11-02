import Link from 'next/link';
import { getCases } from '@/lib/content';
import { deleteCaseAction } from '@/lib/actions/crud';
import { Button } from '@/components/ui/button';

/** 案例列表。 */
export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: { saved?: string; deleted?: string; error?: string };
}) {
  const cases = await getCases();
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">客户案例</h1>
        <Button asChild size="sm"><Link href="/admin/cases/new">+ 新增案例</Link></Button>
      </div>
      {searchParams.saved && <p className="mb-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">✓ 已保存</p>}
      {searchParams.error === 'slug' && <p className="mb-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">slug 重复</p>}

      <div className="card divide-y divide-line">
        {cases.map((c) => (
          <div key={c.slug} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.date} · /cases/{c.slug}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button asChild variant="ghost" size="sm"><Link href={`/admin/cases/${c.slug}`}>编辑</Link></Button>
              <form action={deleteCaseAction}>
                <input type="hidden" name="slug" value={c.slug} />
                <Button type="submit" variant="ghost" size="sm" className="text-destructive">删除</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
