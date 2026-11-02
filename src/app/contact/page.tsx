import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import InquiryForm from '@/components/InquiryForm';
import { getCategories, getProducts, getSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact information: email, phone, WhatsApp, address and social media.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const [settings, categories, products] = await Promise.all([
    getSettings(), getCategories(), getProducts(),
  ]);
  const productOptions = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    category: categories.find((c) => c.slug === p.categorySlug)?.name ?? 'Products',
  }));

  const contactRows = [
    { label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { label: 'Phone', value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    { label: 'WhatsApp', value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}` },
    { label: 'Address', value: settings.address },
  ];

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
      <h1 className="text-3xl font-extrabold text-ink">Contact Us</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div>
          <h2 className="section-title text-xl">Reach Us</h2>
          <dl className="mt-6 space-y-5">
            {contactRows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-bold uppercase tracking-wider text-brand">{row.label}</dt>
                <dd className="mt-1 text-sm text-ink">
                  {row.href ? (
                    <a href={row.href} className="hover:text-brand">{row.value}</a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand">Follow Us</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {settings.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand hover:text-brand"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="section-title text-xl">Leave a Message</h2>
          <div className="mt-6">
            <Suspense fallback={<div className="card p-8 text-sm text-muted-foreground">Loading form…</div>}>
              <InquiryForm productOptions={productOptions} source="contact-page" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
