import { getBanners } from '@/lib/content';
import { saveBannerAction, deleteBannerAction } from '@/lib/actions/crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/** 首页 Banner 管理：第 1 条为 Hero 主图，第 2 条为工厂实力区块。 */
export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: { edit?: string; saved?: string; deleted?: string };
}) {
  const banners = await getBanners();
  const editing = searchParams.edit ? banners.find((b) => b.id === searchParams.edit) : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-ink">首页 Banner</h1>
      {searchParams.saved && <p className="mb-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">✓ 已保存</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt="" className="aspect-[16/6] w-full object-cover" />
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.subtitle}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <a href={`/admin/banners?edit=${b.id}`}>编辑</a>
                  </Button>
                  <form action={deleteBannerAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive">删除</Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form action={saveBannerAction} className="card h-fit space-y-4 p-6">
          <p className="text-sm font-bold text-ink">{editing ? '编辑 Banner' : '新增 Banner'}</p>
          <input type="hidden" name="id" value={editing?.id ?? ''} />
          <div>
            <Label className="mb-1 block">主标题 *</Label>
            <Input name="title" defaultValue={editing?.title} required />
          </div>
          <div>
            <Label className="mb-1 block">副标题</Label>
            <Textarea name="subtitle" rows={2} defaultValue={editing?.subtitle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 block">按钮文字</Label>
              <Input name="ctaText" defaultValue={editing?.ctaText} placeholder="Get a Quote" />
            </div>
            <div>
              <Label className="mb-1 block">按钮链接</Label>
              <Input name="ctaHref" defaultValue={editing?.ctaHref} placeholder="/inquiry" />
            </div>
          </div>
          <div>
            <Label className="mb-1 block">图片 URL</Label>
            <Input name="image" defaultValue={editing?.image} placeholder="/placeholders/banner-1.svg" />
          </div>
          <div>
            <Label className="mb-1 block">排序（小的在前）</Label>
            <Input name="sort" type="number" defaultValue={editing?.sort ?? 0} />
          </div>
          <div className="flex gap-2">
            <Button type="submit">保存</Button>
            {editing && <Button asChild variant="outline"><a href="/admin/banners">取消编辑</a></Button>}
          </div>
        </form>
      </div>
    </div>
  );
}
