import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/content';
import { deleteProductAction, toggleProductAction } from '@/lib/actions/crud';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

/** 产品管理列表：新增 / 编辑 / 上下架 / 删除。 */
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { saved?: string; deleted?: string; error?: string };
}) {
  const [products, categories] = await Promise.all([getProducts(true), getCategories()]);
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? '—';

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">产品管理</h1>
        <Button asChild size="sm"><Link href="/admin/products/new">+ 新增产品</Link></Button>
      </div>

      {searchParams.saved && <p className="mb-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">✓ 已保存，前台已同步更新</p>}
      {searchParams.deleted && <p className="mb-4 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground">已删除</p>}
      {searchParams.error === 'slug' && (
        <p className="mb-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">保存失败：slug 与现有产品重复</p>
      )}

      <div className="card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-accent">产品</TableHead>
              <TableHead className="bg-accent">分类</TableHead>
              <TableHead className="bg-accent">slug</TableHead>
              <TableHead className="bg-accent">状态</TableHead>
              <TableHead className="bg-accent text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="max-w-xs truncate text-xs text-muted-foreground">{p.tagline}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{catName(p.categorySlug)}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.slug}</TableCell>
                <TableCell>
                  <Badge variant={p.published ? 'brand' : 'secondary'}>{p.published ? '已上架' : '已下架'}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm"><Link href={`/admin/products/${p.id}`}>编辑</Link></Button>
                    <form action={toggleProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button type="submit" variant="ghost" size="sm">{p.published ? '下架' : '上架'}</Button>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button type="submit" variant="ghost" size="sm" className="text-destructive">删除</Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        提示：产品的导航下拉、产品页、询盘表单选项三处联动，改这里即可全站生效。
      </p>
    </div>
  );
}
