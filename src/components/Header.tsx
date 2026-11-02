import Link from 'next/link';
import { getNavigation, getSettings, getProductsByCategory } from '@/lib/content';
import MobileNav from './MobileNav';

/** 顶部导航（服务端组件）：桌面端「产品中心」下拉悬停展开（分类 → 产品，数据驱动自动更新）。 */
export default function Header() {
  const settings = getSettings();
  const nav = getNavigation();
  const grouped = getProductsByCategory().filter((g) => g.products.length > 0);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label={`${settings.companyName} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-sm font-black text-white">
            {settings.logoText.slice(0, 1)}
          </span>
          <span className="text-base font-extrabold uppercase tracking-wide text-ink">
            {settings.logoText}
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {nav.map((item) =>
            item.dropdown ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-ink hover:bg-brand-tint hover:text-brand"
                >
                  {item.label}
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
                {/* 产品下拉：分类 → 产品（与询盘表单、产品页同源，Admin 改产品后自动更新） */}
                <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <div className="card overflow-hidden p-2 shadow-lg">
                    {grouped.map(({ category, products }) => (
                      <div key={category.slug} className="mb-1 last:mb-0">
                        <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-muted">
                          {category.name}
                        </p>
                        {products.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/products/${p.slug}`}
                            className="block rounded px-3 py-2 text-sm text-ink hover:bg-brand-tint hover:text-brand"
                          >
                            {p.name}
                            <span className="block truncate text-xs text-muted">{p.tagline}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                    <Link
                      href="/products"
                      className="mt-1 block rounded bg-brand-tint px-3 py-2 text-center text-sm font-semibold text-brand"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-medium text-ink hover:bg-brand-tint hover:text-brand"
              >
                {item.label}
              </Link>
            ),
          )}
          <Link href="/inquiry" className="btn-primary ml-3 !px-5 !py-2">
            Get a Quote
          </Link>
        </nav>

        {/* 移动端菜单（客户端组件） */}
        <MobileNav
          grouped={grouped.map(({ category, products }) => ({
            name: category.name,
            products: products.map((p) => ({ name: p.name, href: `/products/${p.slug}` })),
          }))}
        />
      </div>
    </header>
  );
}
