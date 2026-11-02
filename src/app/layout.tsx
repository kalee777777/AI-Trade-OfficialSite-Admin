import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import { getSettings, getSiteUrl } from '@/lib/content';

/** 全站默认 SEO：title 模板 + OG + Organization JSON-LD。每页可用 generateMetadata 覆盖。 */
export function generateMetadata(): Metadata {
  const s = getSettings();
  return {
    metadataBase: new URL(getSiteUrl()),
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.companyName,
    url: getSiteUrl(),
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
