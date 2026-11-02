import { getCategories } from '@/lib/content';
import { saveCategoryAction, deleteCategoryAction } from '@/lib/actions/crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/** 产品分类管理：列表 + 表单（?edit=<id> 预填；不填 id 为新增）。 */
export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: { edit?: string; saved?: string; deleted?: string; error?: string };
}) {
  const categories = await getCategories();
  const editing = searchParams.edit ? categories.find((c) => c.id === searchParams.edit) : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-ink">产品分类</h1>
      {searchParams.saved && <p className="mb-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">✓ 已保存</p>}
      {searchParams.error === 'slug' && <p className="mb-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">slug 重复</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="card flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-ink">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">/{c.slug} · {c.description || '无描述'}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button asChild variant="ghost" size="sm">
                  <a href={`/admin/categories?edit=${c.id}`}>编辑</a>
                </Button>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <Button type="submit" variant="ghost" size="sm" className="text-destructive">删除</Button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <form action={saveCategoryAction} className="card h-fit space-y-4 p-6">
          <p className="text-sm font-bold text-ink">{editing ? `编辑：${editing.name}` : '新增分类'}</p>
          <input type="hidden" name="id" value={editing?.id ?? ''} />
          <div>
            <Label className="mb-1 block">分类名称 *</Label>
            <Input name="name" defaultValue={editing?.name} placeholder="e.g. Wire Mesh" required />
          </div>
          <div>
            <Label className="mb-1 block">slug *</Label>
            <Input name="slug" defaultValue={editing?.slug} placeholder="e.g. wire-mesh" required />
          </div>
          <div>
            <Label className="mb-1 block">描述</Label>
            <Textarea name="description" rows={2} defaultValue={editing?.description} />
          </div>
          <div>
            <Label className="mb-1 block">排序</Label>
            <Input name="sort" type="number" defaultValue={editing?.sort ?? 0} />
          </div>
          <div className="flex gap-2">
            <Button type="submit">保存</Button>
            {editing && (
              <Button asChild variant="outline"><a href="/admin/categories">取消编辑</a></Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
