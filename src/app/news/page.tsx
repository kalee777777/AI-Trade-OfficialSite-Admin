import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getNews } from '@/lib/content';

export const metadata: Metadata = {
  title: 'News',
  description: 'Company news, exhibition updates and buyer guides.',
  alternates: { canonical: '/news' },
};

export default function NewsPage() {
  const news = getNews();

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News' }]} />
      <h1 className="text-3xl font-extrabold text-ink">News & Insights</h1>

      <div className="mt-10 space-y-6">
        {news.map((n) => (
          <Link key={n.slug} href={`/news/${n.slug}`} className="card group block p-6 hover:shadow-lg">
            <p className="text-xs text-muted-foreground">{n.date}</p>
            <h2 className="mt-1 text-lg font-bold text-ink group-hover:text-brand">{n.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{n.summary}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand">Read More →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
