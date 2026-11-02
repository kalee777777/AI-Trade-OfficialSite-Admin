import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { getNews, getNewsBySlug, getSettings, getSiteUrl } from '@/lib/content';

export function generateStaticParams() {
  return getNews().map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const n = getNewsBySlug(params.slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.summary,
    alternates: { canonical: `/news/${n.slug}` },
    openGraph: { type: 'article', title: n.title, description: n.summary },
  };
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const n = getNewsBySlug(params.slug);
  if (!n) notFound();

  const settings = getSettings();
  const base = getSiteUrl();
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: n.title,
    description: n.summary,
    datePublished: n.date,
    author: { '@type': 'Organization', name: settings.companyName },
    publisher: {
      '@type': 'Organization',
      name: settings.companyName,
    },
    mainEntityOfPage: `${base}/news/${n.slug}`,
  };

  return (
    <div className="container-x py-10">
      <JsonLd data={articleJsonLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: n.title }]} />
      <article className="max-w-3xl">
        <p className="text-xs text-muted-foreground">
          <time dateTime={n.date}>{n.date}</time>
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{n.title}</h1>
        {n.content.map((para, i) => (
          <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">{para}</p>
        ))}
      </article>
    </div>
  );
}
