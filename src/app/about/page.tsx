import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { getAbout, getSettings } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  return {
    title: 'About Us',
    description: about.intro[0]?.replace(/^\[PLACEHOLDER\]\s*/, '') || 'Company introduction.',
    alternates: { canonical: '/about' },
  };
}

/** 关于我们：企业简介 / 工厂实力 / 企业文化。 */
export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()]);

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
      <h1 className="text-3xl font-extrabold text-ink">About {settings.companyName}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          {about.intro.map((para, i) => (
            <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">{para}</p>
          ))}
          <div className="mt-6 card bg-accent p-6">
            <h2 className="text-base font-bold text-ink">Our Culture</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{about.culture}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.image}
            alt={`${settings.companyName} factory`}
            className="h-full w-full object-cover"
            width={1200} height={800}
          />
        </div>
      </div>

      <section className="mt-14">
        <h2 className="section-title">Factory Strength</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {about.factory.map((f) => (
            <div key={f.title} className="card p-6">
              <h3 className="text-base font-bold text-brand">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14 text-center">
        <Button asChild size="lg"><Link href="/inquiry">Start Working With Us</Link></Button>
      </div>
    </div>
  );
}
