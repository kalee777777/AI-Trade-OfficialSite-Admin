import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/content';
import ProductForm from '@/components/admin/ProductForm';

/** 产品编辑页：id=new 为新建，否则编辑既有产品。 */
export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const [products, categories] = await Promise.all([getProducts(true), getCategories()]);
  const isNew = params.id === 'new';
  const product = isNew ? null : products.find((p) => p.id === params.id) ?? null;
  if (!isNew && !product) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{isNew ? '新增产品' : `编辑：${product?.name}`}</h1>
        <Link href="/admin/products" className="text-sm text-brand hover:underline">← 返回列表</Link>
      </div>
      {searchParams.error === 'required' && (
        <p className="mb-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">请至少填写产品名称与 slug</p>
      )}
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
