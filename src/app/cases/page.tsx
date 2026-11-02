import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getCases } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real export case studies: customer needs, our solution, and delivered results.',
  alternates: { canonical: '/cases' },
};

export default function CasesPage() {
  const cases = getCases();

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Case Studies' }]} />
      <h1 className="text-3xl font-extrabold text-ink">Case Studies</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
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
              <p className="text-xs text-muted">{c.date}</p>
              <h2 className="mt-1 text-base font-bold text-ink group-hover:text-brand">{c.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{c.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
