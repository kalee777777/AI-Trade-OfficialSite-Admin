'use client';

import { useState } from 'react';
import type { Category, Product } from '@/lib/types';
import { saveProductAction } from '@/lib/actions/crud';
import ArrayField from './ArrayField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/** 产品编辑表单：基础字段 + 规格行/FAQ 行编辑器（ArrayField）+ 段落/特性文本域。 */
export default function ProductForm({
  product,
  categories,
}: {
  product: Product | null;
  categories: Category[];
}) {
  const [base, setBase] = useState({
    id: product?.id ?? '',
    slug: product?.slug ?? '',
    name: product?.name ?? '',
    categorySlug: product?.categorySlug ?? categories[0]?.slug ?? '',
    tagline: product?.tagline ?? '',
    image: product?.image ?? '/placeholders/product-a.svg',
    quotableLine: product?.quotableLine ?? '',
    sort: String(product?.sort ?? 0),
    published: product?.published !== false,
  });
  const [description, setDescription] = useState((product?.description ?? []).join('\n\n'));
  const [features, setFeatures] = useState((product?.features ?? []).join('\n'));
  const [specs, setSpecs] = useState<Record<string, string>[]>(
    (product?.specs ?? []).map((s) => ({ param: s.param, value: s.value })),
  );
  const [faq, setFaq] = useState<Record<string, string>[]>(
    (product?.faq ?? []).map((f) => ({ q: f.q, a: f.a })),
  );

  function buildPayload() {
    return {
      ...base,
      sort: Number(base.sort) || 0,
      description: description.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
      features: features.split(/\n+/).map((s) => s.trim()).filter(Boolean),
      specs: specs.filter((s) => s.param || s.value),
      faq: faq.filter((f) => f.q || f.a),
    };
  }

  return (
    <form action={saveProductAction} className="space-y-6">
      <input type="hidden" name="payload" value={JSON.stringify(buildPayload())} />

      <div className="card space-y-4 p-6">
        <p className="text-sm font-bold text-ink">基础信息</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1 block">产品名称 *</Label>
            <Input value={base.name} onChange={(e) => setBase({ ...base, name: e.target.value })} placeholder="e.g. Welded Wire Mesh" />
          </div>
          <div>
            <Label className="mb-1 block">slug（URL 路径）*</Label>
            <Input value={base.slug} onChange={(e) => setBase({ ...base, slug: e.target.value.replace(/[^a-z0-9-]/g, '-') })} placeholder="e.g. welded-wire-mesh" />
          </div>
          <div>
            <Label className="mb-1 block">分类</Label>
            <select
              className="field h-10"
              value={base.categorySlug}
              onChange={(e) => setBase({ ...base, categorySlug: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="mb-1 block">主图 URL</Label>
            <Input value={base.image} onChange={(e) => setBase({ ...base, image: e.target.value })} placeholder="/placeholders/product-a.svg 或 https://…" />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1 block">一句话卖点</Label>
            <Input value={base.tagline} onChange={(e) => setBase({ ...base, tagline: e.target.value })} placeholder="显示在卡片与详情页标题下" />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1 block">Quick Spec（可直引规格句 · GEO）</Label>
            <Textarea
              rows={2}
              value={base.quotableLine}
              onChange={(e) => setBase({ ...base, quotableLine: e.target.value })}
              placeholder="一句话完整规格：Product A is a … made of …, MOQ …, lead time …"
            />
          </div>
          <div>
            <Label className="mb-1 block">排序（小的在前）</Label>
            <Input value={base.sort} onChange={(e) => setBase({ ...base, sort: e.target.value })} />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={base.published}
                onChange={(e) => setBase({ ...base, published: e.target.checked })}
              />
              上架（前台可见）
            </label>
          </div>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <p className="text-sm font-bold text-ink">图文内容</p>
        <div>
          <Label className="mb-1 block">产品描述（段落之间空一行）</Label>
          <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">产品特点（一行一条）</Label>
          <Textarea rows={4} value={features} onChange={(e) => setFeatures(e.target.value)} />
        </div>
      </div>

      <div className="card space-y-6 p-6">
        <p className="text-sm font-bold text-ink">规格参数 &amp; FAQ</p>
        <ArrayField
          title="规格参数表（显示在产品页 Specifications）"
          fields={[
            { key: 'param', label: '参数名', placeholder: 'Material' },
            { key: 'value', label: '参数值', placeholder: 'Q235B steel' },
          ]}
          rows={specs}
          onChange={setSpecs}
          blank={() => ({ param: '', value: '' })}
          addLabel="＋ 添加规格行"
        />
        <ArrayField
          title="FAQ（同步输出 FAQPage 结构化数据）"
          fields={[
            { key: 'q', label: '问题', placeholder: 'What is your MOQ?' },
            { key: 'a', label: '回答', placeholder: 'Our MOQ is …' },
          ]}
          rows={faq}
          onChange={setFaq}
          blank={() => ({ q: '', a: '' })}
          addLabel="＋ 添加 FAQ"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit">保存产品</Button>
        <Button asChild variant="outline"><a href="/admin/products">取消</a></Button>
      </div>
    </form>
  );
}
