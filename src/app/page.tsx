import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import {
  getBanners, getTrustStats, getAdvantages, getProducts,
  getCases, getNews, getSettings,
} from '@/lib/content';

/** 首页：Banner → 信任数据条 → 产品区 → 企业优势 → 案例 → 新闻 → CTA。 */
export default function HomePage() {
  const banners = getBanners();
  const stats = getTrustStats();
  const products = getProducts().slice(0, 4);
  const advantages = getAdvantages();
  const cases = getCases().slice(0, 2);
  const news = getNews().slice(0, 3);
  const settings = getSettings();
  const hero = banners[0];
  const secondary = banners[1];

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-brand-dark text-white">
        <div className="container-x grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
              {hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg"><Link href={hero.ctaHref}>{hero.ctaText}</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/products">Browse Products</Link></Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.image}
              alt={`${settings.companyName} — ${settings.tagline}`}
              className="h-full w-full object-cover"
              width={800} height={600}
            />
          </div>
        </div>
      </section>

      {/* 信任数据条 */}
      <section className="border-b border-line bg-brand-tint">
        <div className="container-x grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-brand">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 核心产品 */}
      <section className="container-x py-16">
        <div className="mb-8 text-center">
          <p className="section-eyebrow">Our Products</p>
          <h2 className="section-title">Core Products</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Factory-direct manufacturing with stable quality and OEM support.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline"><Link href="/products">View All Products</Link></Button>
        </div>
      </section>

      {/* 企业优势 */}
      <section className="bg-brand-tint py-16">
        <div className="container-x">
          <div className="mb-8 text-center">
            <p className="section-eyebrow">Why Choose Us</p>
            <h2 className="section-title">Our Advantages</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((adv, i) => (
              <div key={adv.title} className="card p-6">
                <p className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 text-base font-bold text-ink">{adv.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 第二 Banner（工厂实力） */}
      {secondary && (
        <section className="container-x py-16">
          <div className="card grid items-center gap-8 overflow-hidden md:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondary.image}
              alt={secondary.title}
              className="h-full w-full object-cover"
              width={800} height={500}
            />
            <div className="p-8 md:pr-12">
              <h2 className="text-2xl font-bold text-ink">{secondary.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{secondary.subtitle}</p>
              <Button asChild variant="outline" className="mt-6"><Link href={secondary.ctaHref}>{secondary.ctaText}</Link></Button>
            </div>
          </div>
        </section>
      )}

      {/* 客户案例 */}
      <section className="container-x pb-16">
        <div className="mb-8 text-center">
          <p className="section-eyebrow">Case Studies</p>
          <h2 className="section-title">What We Delivered</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <Link key={c.slug} href={`/cases/${c.slug}`} className="card group overflow-hidden hover:shadow-lg">
              <div className="aspect-[16/8] overflow-hidden bg-brand-tint">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image} alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-foreground">{c.date}</p>
                <h3 className="mt-1 text-base font-bold text-ink group-hover:text-brand">{c.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 新闻 */}
      <section className="container-x pb-16">
        <div className="mb-8 text-center">
          <p className="section-eyebrow">News</p>
          <h2 className="section-title">Latest News</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {news.map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`} className="card group p-6 hover:shadow-lg">
              <p className="text-xs text-muted-foreground">{n.date}</p>
              <h3 className="mt-1 text-base font-bold text-ink group-hover:text-brand">{n.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA 询盘带 */}
      <section className="bg-brand py-14 text-center text-white">
        <div className="container-x">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to Start Your Project?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">
            Send us your requirements — specifications, quantity and destination port — and get a
            factory-direct quotation within 24 hours.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/inquiry">Get a Free Quotation</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
