import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import InquiryForm from '@/components/InquiryForm';
import { Button } from '@/components/ui/button';
import { getCategories, getProducts, getSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Inquiry',
  description: 'Send your requirements (product, specifications, quantity, destination) and get a factory-direct quotation within 24 hours.',
  alternates: { canonical: '/inquiry' },
};

/** 询盘中心：表单 + 信任背书侧栏。产品下拉与全站产品数据同源。 */
export default async function InquiryPage() {
  const [settings, categories, products] = await Promise.all([
    getSettings(), getCategories(), getProducts(),
  ]);
  const productOptions = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    category: categories.find((c) => c.slug === p.categorySlug)?.name ?? 'Products',
  }));

  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Inquiry' }]} />
      <h1 className="text-3xl font-extrabold text-ink">Send an Inquiry</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Tell us what you need — product, specifications, quantity and destination port —
        and our export team will reply with a quotation within 24 hours.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="card p-8 text-sm text-muted-foreground">Loading form…</div>}>
            <InquiryForm productOptions={productOptions} source="inquiry-page" />
          </Suspense>
        </div>

        <aside className="space-y-6">
          <div className="card bg-accent p-6">
            <h2 className="text-base font-bold text-ink">Why inquire directly?</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>✔ Factory-direct quotation, no middlemen</li>
              <li>✔ Reply within 24 hours on business days</li>
              <li>✔ OEM/ODM customization supported</li>
              <li>✔ Your information stays confidential</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-base font-bold text-ink">Prefer instant chat?</h2>
            <Button asChild className="mt-4 w-full">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank" rel="noopener noreferrer"
              >
                WhatsApp Us Now
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">Or email: {settings.email}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
