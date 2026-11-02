import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import { getSettings, getSiteUrl } from '@/lib/content';

/** 全站默认 SEO：title 模板 + OG + Organization JSON-LD。每页可用 generateMetadata 覆盖。 */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = await getSiteUrl();
  return {
    metadataBase: new URL(base),
    title: {
      default: `${s.companyName} — ${s.tagline}`,
      template: `%s | ${s.companyName}`,
    },
    description: s.description,
    keywords: s.seoKeywords,
    openGraph: {
      type: 'website',
      siteName: s.companyName,
      title: `${s.companyName} — ${s.tagline}`,
      description: s.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const base = await getSiteUrl();
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.companyName,
    url: base,
    description: s.description,
    email: s.email,
    telephone: s.phone,
    address: s.address,
    sameAs: s.socials.map((soc) => soc.url),
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <JsonLd data={orgJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
