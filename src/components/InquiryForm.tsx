'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface FormProductOption {
  name: string;
  slug: string;
  category: string;
}

/**
 * 询盘表单（询盘页 / 产品页 CTA / 联系页共用）。
 * 产品下拉与站点产品数据同源（分组 optgroup），URL 带 ?product=<slug> 时自动预选。
 * 防垃圾：honeypot 隐藏字段 + 提交耗时检测（服务端复核）。
 * 注：产品选择保留原生 select（移动端体验 + optgroup 分组）；ui/Select 供 Admin 后台使用。
 */
export default function InquiryForm({
  productOptions,
  source,
}: {
  productOptions: FormProductOption[];
  source: string;
}) {
  const searchParams = useSearchParams();
  const mountedAt = useRef<number>(Date.now());
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    phone: '',
    product: '',
    message: '',
    website: '', // honeypot：真实用户永远为空
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  // URL 预选产品（?product=product-a）
  useEffect(() => {
    const slug = searchParams.get('product');
    if (slug && productOptions.some((p) => p.slug === slug)) {
      setForm((f) => ({ ...f, product: slug }));
    }
  }, [searchParams, productOptions]);

  // 按 optgroup 分组
  const groups = Array.from(new Set(productOptions.map((p) => p.category)));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          elapsedMs: Date.now() - mountedAt.current,
          source,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Submission failed, please try again.');
      }
      setStatus('ok');
      setForm({
        name: '', email: '', company: '', country: '',
        phone: '', product: '', message: '', website: '',
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Network error, please try again.');
    }
  }

  if (status === 'ok') {
    return (
      <div className="card p-8 text-center">
        <p className="text-3xl" aria-hidden="true">✅</p>
        <h3 className="mt-2 text-lg font-bold text-ink">Thank you! Your inquiry has been received.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We will reply within 24 hours (usually much faster). For urgent needs, contact us on WhatsApp.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus('idle')}>
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="inq-name" className="mb-1 block">
            Your Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inq-name" required maxLength={100}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Smith"
          />
        </div>
        <div>
          <Label htmlFor="inq-email" className="mb-1 block">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inq-email" type="email" required maxLength={200}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@company.com"
          />
        </div>
        <div>
          <Label htmlFor="inq-company" className="mb-1 block">Company</Label>
          <Input
            id="inq-company" maxLength={200}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Company name"
          />
        </div>
        <div>
          <Label htmlFor="inq-country" className="mb-1 block">Country</Label>
          <Input
            id="inq-country" maxLength={100}
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="United States"
          />
        </div>
        <div>
          <Label htmlFor="inq-phone" className="mb-1 block">Phone / WhatsApp</Label>
          <Input
            id="inq-phone" maxLength={50}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 555 000 0000"
          />
        </div>
        <div>
          <Label htmlFor="inq-product" className="mb-1 block">Product of Interest</Label>
          <select
            id="inq-product"
            className="field"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          >
            <option value="">— Select a product —</option>
            {groups.map((cat) => (
              <optgroup key={cat} label={cat}>
                {productOptions
                  .filter((p) => p.category === cat)
                  .map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
              </optgroup>
            ))}
            <option value="other">Other / Not listed</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="inq-message" className="mb-1 block">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="inq-message" required rows={5} maxLength={3000}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Please describe your requirements: product, specifications, quantity, target price, destination port..."
          />
        </div>
      </div>

      {/* honeypot：对真实用户不可见，机器人填了即静默丢弃 */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="inq-website">Website</label>
        <input
          id="inq-website" tabIndex={-1} autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      {status === 'error' && (
        <p className="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={status === 'sending'} className="mt-6 w-full sm:w-auto">
        {status === 'sending' ? 'Sending...' : 'Submit Inquiry'}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        We reply within 24 hours. Your information is only used to respond to this inquiry.
      </p>
    </form>
  );
}
