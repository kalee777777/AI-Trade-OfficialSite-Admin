import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse all product categories. Factory-direct manufacturing, OEM/ODM support and stable export quality.',
  alternates: { canonical: '/products' },
};

/** 产品列表页：按分类分组展示，与导航下拉、询盘表单同源。 */
export default function ProductsPage() {
  const grouped = getProductsByCategory().filter((g) => g.products.length > 0);

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
      <h1 className="text-3xl font-extrabold text-ink">Products</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        All products are manufactured in-house with OEM/ODM support. Click any product for full specifications.
      </p>

      {grouped.map(({ category, products }) => (
        <section key={category.slug} className="mt-12">
          <div className="mb-6 border-l-4 border-brand pl-4">
            <h2 className="text-xl font-bold text-ink">{category.name}</h2>
            <p className="mt-1 text-sm text-muted">{category.description}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
