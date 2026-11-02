'use client';

import { useState } from 'react';
import { saveSettingsAction } from '@/lib/actions/crud';
import type { SiteSettings } from '@/lib/types';
import ArrayField from './ArrayField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/** 站点设置表单：公司信息 / 联系方式 / 社交 / SEO（保存后全站与结构化数据同步）。 */
export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({
    companyName: settings.companyName,
    tagline: settings.tagline,
    domain: settings.domain,
    logoText: settings.logoText,
    description: settings.description,
    seoKeywords: settings.seoKeywords.join(', '),
    email: settings.email,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    address: settings.address,
    footerNote: settings.footerNote,
  });
  const [socials, setSocials] = useState<Record<string, string>[]>(
    settings.socials.map((s) => ({ platform: s.platform, url: s.url })),
  );

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  function buildPayload() {
    return {
      ...form,
      seoKeywords: form.seoKeywords.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      socials: socials.filter((s) => s.platform || s.url),
    };
  }

  return (
    <form action={saveSettingsAction} className="space-y-6">
      <input type="hidden" name="payload" value={JSON.stringify(buildPayload())} />

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <p className="text-sm font-bold text-ink sm:col-span-2">公司信息（影响全站标题/页脚/结构化数据）</p>
        <div>
          <Label className="mb-1 block">公司名称</Label>
          <Input value={form.companyName} onChange={set('companyName')} />
        </div>
        <div>
          <Label className="mb-1 block">标语 Tagline</Label>
          <Input value={form.tagline} onChange={set('tagline')} />
        </div>
        <div>
          <Label className="mb-1 block">站点域名（canonical/OG 用）</Label>
          <Input value={form.domain} onChange={set('domain')} placeholder="https://www.yourcompany.com" />
        </div>
        <div>
          <Label className="mb-1 block">Logo 文字</Label>
          <Input value={form.logoText} onChange={set('logoText')} />
        </div>
        <div className="sm:col-span-2">
          <Label className="mb-1 block">SEO 描述（首页 meta description，150–160 字符）</Label>
          <Textarea rows={2} value={form.description} onChange={set('description')} />
        </div>
        <div className="sm:col-span-2">
          <Label className="mb-1 block">SEO 关键词（逗号分隔）</Label>
          <Input value={form.seoKeywords} onChange={set('seoKeywords')} />
        </div>
      </div>

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <p className="text-sm font-bold text-ink sm:col-span-2">联系方式</p>
        <div>
          <Label className="mb-1 block">邮箱</Label>
          <Input type="email" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <Label className="mb-1 block">电话</Label>
          <Input value={form.phone} onChange={set('phone')} />
        </div>
        <div>
          <Label className="mb-1 block">WhatsApp（含国际区号）</Label>
          <Input value={form.whatsapp} onChange={set('whatsapp')} placeholder="+8613800000000" />
        </div>
        <div>
          <Label className="mb-1 block">地址</Label>
          <Input value={form.address} onChange={set('address')} />
        </div>
        <div className="sm:col-span-2">
          <Label className="mb-1 block">页脚一句话</Label>
          <Input value={form.footerNote} onChange={set('footerNote')} />
        </div>
      </div>

      <div className="card p-6">
        <p className="mb-4 text-sm font-bold text-ink">社交链接</p>
        <ArrayField
          title=""
          fields={[
            { key: 'platform', label: '平台', placeholder: 'LinkedIn' },
            { key: 'url', label: '链接', placeholder: 'https://linkedin.com/company/…' },
          ]}
          rows={socials}
          onChange={setSocials}
          blank={() => ({ platform: '', url: '' })}
          addLabel="＋ 添加社交链接"
        />
      </div>

      <Button type="submit">保存设置</Button>
    </form>
  );
}
