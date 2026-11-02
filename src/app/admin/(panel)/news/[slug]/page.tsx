import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNews, getNewsBySlug } from '@/lib/content';
import { saveNewsAction } from '@/lib/actions/crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/** 新闻编辑页：slug=new 为新建。正文一段一行。 */
export default async function AdminNewsEditPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { error?: string };
}) {
  const isNew = params.slug === 'new';
  const item = isNew ? null : (await getNews()).find((n) => n.slug === params.slug) ?? (await getNewsBySlug(params.slug));
  if (!isNew && !item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{isNew ? '新增新闻' : '编辑新闻'}</h1>
        <Link href="/admin/news" className="text-sm text-brand hover:underline">← 返回列表</Link>
      </div>
      {searchParams.error === 'required' && (
        <p className="mb-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">请填写标题与 slug</p>
      )}

      <form action={saveNewsAction} className="card space-y-4 p-6">
        <input type="hidden" name="orig" value={item?.slug ?? 'new'} />
        <div>
          <Label className="mb-1 block">标题 *</Label>
          <Input name="title" defaultValue={item?.title} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block">slug *</Label>
            <Input name="slug" defaultValue={item?.slug} required placeholder="news-1" />
          </div>
          <div>
            <Label className="mb-1 block">发布日期</Label>
            <Input name="date" type="date" defaultValue={item?.date ?? new Date().toISOString().slice(0, 10)} />
          </div>
        </div>
        <div>
          <Label className="mb-1 block">摘要（列表页与 SEO description）</Label>
          <Textarea name="summary" rows={2} defaultValue={item?.summary} />
        </div>
        <div>
          <Label className="mb-1 block">正文（一段一行）</Label>
          <Textarea name="content" rows={8} defaultValue={(item?.content ?? []).join('\n')} />
        </div>
        <div>
          <Label className="mb-1 block">排序</Label>
          <Input name="sort" type="number" defaultValue={item?.sort ?? 0} />
        </div>
        <Button type="submit">保存</Button>
      </form>
    </div>
  );
}
