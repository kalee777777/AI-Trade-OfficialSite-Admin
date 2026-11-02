import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { getProducts, getProductBySlug, getCategoryBySlug, getRelatedProducts, getSettings, getSiteUrl } from '@/lib/content';

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.tagline.replace(/^\[PLACEHOLDER\]\s*/, '')}`,
    description: product.quotableLine,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [product.image],
    },
  };
}

/** 产品详情页：规格表 / 特点 / FAQ / 可直引规格句（GEO）/ 相关产品 / 询盘 CTA（带产品预选）。 */
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [category, related, settings, base] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getRelatedProducts(product),
    getSettings(),
    getSiteUrl(),
  ]);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.quotableLine,
    image: `${base}${product.image}`,
    brand: { '@type': 'Brand', name: settings.companyName },
    manufacturer: { '@type': 'Organization', name: settings.companyName },
    additionalProperty: product.specs.map((s) => ({
      '@type': 'PropertyValue',
      name: s.param,
      value: s.value,
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${base}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${base}/products/${product.slug}` },
    ],
  };

  return (
    <div className="container-x py-10">
      <JsonLd data={[productJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          ...(category ? [{ label: category.name, href: '/products' }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-line bg-accent">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={`${product.name} — ${product.tagline}`}
            className="h-full w-full object-cover"
            width={800} height={600}
          />
        </div>
        <div>
          {category && <Badge variant="brand" className="mb-3">{category.name}</Badge>}
          <h1 className="text-3xl font-extrabold text-ink">{product.name}</h1>
          <p className="mt-2 text-base text-brand">{product.tagline}</p>
          {product.description.map((para, i) => (
            <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">{para}</p>
          ))}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild>
              <Link href={`/inquiry?product=${product.slug}`}>Inquiry This Product</Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hello, I am interested in ${product.name}.`)}`}
                target="_blank" rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* 可直引规格句（GEO）：完整规格的一句话表述，AI 搜索可直接引用 */}
      <section className="mt-12 rounded-lg border border-brand-light bg-accent p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand">Quick Spec</p>
        <p className="mt-2 text-base font-medium leading-relaxed text-ink">{product.quotableLine}</p>
      </section>

      {/* 规格参数表（shadcn/ui Table） */}
      <section className="mt-12">
        <h2 className="section-title">Specifications</h2>
        <div className="card mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%] bg-accent font-semibold text-ink">Parameter</TableHead>
                <TableHead className="bg-accent font-semibold text-ink">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.specs.map((s) => (
                <TableRow key={s.param}>
                  <TableCell className="font-semibold text-ink">{s.param}</TableCell>
                  <TableCell className="text-muted-foreground">{s.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 产品特点 */}
      <section className="mt-12">
        <h2 className="section-title">Key Features</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {product.features.map((f, i) => (
            <li key={i} className="card flex items-start gap-3 p-4">
              <span className="mt-0.5 text-brand" aria-hidden="true">✔</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ（Radix 手风琴，内容始终在 DOM 中；FAQPage JSON-LD 已输出） */}
      <section className="mt-12">
        <h2 className="section-title">FAQ</h2>
        <div className="card mt-6 px-6">
          <FaqAccordion items={product.faq} productName={product.name} />
        </div>
      </section>

      {/* 相关产品 */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title">Related Products</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
