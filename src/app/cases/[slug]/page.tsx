import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getCases, getCaseBySlug, getProductBySlug } from '@/lib/content';

export async function generateStaticParams() {
  return (await getCases()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = await getCaseBySlug(params.slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.summary,
    alternates: { canonical: `/cases/${c.slug}` },
  };
}

export default async function CaseDetailPage({ params }: { params: { slug: string } }) {
  const c = await getCaseBySlug(params.slug);
  if (!c) notFound();

  const relatedProducts = (
    await Promise.all(c.products.map((slug) => getProductBySlug(slug)))
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Case Studies', href: '/cases' }, { label: c.title }]} />
      <article>
        <p className="text-xs text-muted-foreground">{c.date}</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{c.title}</h1>

        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-accent">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.image} alt={c.title} className="h-full w-full object-cover" width={1200} height={600} />
        </div>

        <div className="mt-8 max-w-3xl">
          {c.content.map((para, i) => (
            <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">{para}</p>
          ))}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-10 card bg-accent p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Products in This Case</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {relatedProducts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="rounded-md border border-brand-light bg-paper px-4 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
