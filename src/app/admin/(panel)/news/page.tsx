import Link from 'next/link';
import { getNews } from '@/lib/content';
import { deleteNewsAction } from '@/lib/actions/crud';
import { Button } from '@/components/ui/button';

/** 新闻列表。 */
export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: { saved?: string; deleted?: string; error?: string };
}) {
  const news = await getNews();
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">新闻动态</h1>
        <Button asChild size="sm"><Link href="/admin/news/new">+ 新增新闻</Link></Button>
      </div>
      {searchParams.saved && <p className="mb-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">✓ 已保存</p>}
      {searchParams.error === 'slug' && <p className="mb-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">slug 重复</p>}

      <div className="card divide-y divide-line">
        {news.map((n) => (
          <div key={n.slug} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.date} · /news/{n.slug}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button asChild variant="ghost" size="sm"><Link href={`/admin/news/${n.slug}`}>编辑</Link></Button>
              <form action={deleteNewsAction}>
                <input type="hidden" name="slug" value={n.slug} />
                <Button type="submit" variant="ghost" size="sm" className="text-destructive">删除</Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
