'use client';

import { useState } from 'react';
import { saveBlocksAction } from '@/lib/actions/crud';
import type { TrustStat, Advantage, AboutContent, NavItem } from '@/lib/types';
import ArrayField from './ArrayField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/** 页面区块编辑：首页信任数据/企业优势 + 关于我们 + 导航菜单（一个表单一起保存）。 */
export default function BlocksForm({
  trustStats,
  advantages,
  about,
  navigation,
}: {
  trustStats: TrustStat[];
  advantages: Advantage[];
  about: AboutContent;
  navigation: NavItem[];
}) {
  const [stats, setStats] = useState<Record<string, string>[]>(
    trustStats.map((s) => ({ value: s.value, label: s.label })),
  );
  const [advs, setAdvs] = useState<Record<string, string>[]>(
    advantages.map((a) => ({ title: a.title, description: a.description })),
  );
  const [intro, setIntro] = useState(about.intro.join('\n\n'));
  const [factory, setFactory] = useState<Record<string, string>[]>(
    about.factory.map((f) => ({ title: f.title, text: f.text })),
  );
  const [culture, setCulture] = useState(about.culture);
  const [aboutImage, setAboutImage] = useState(about.image);
  const [nav, setNav] = useState<Record<string, string>[]>(
    navigation.map((n) => ({ label: n.label, href: n.href, dropdown: n.dropdown ? '1' : '' })),
  );

  function buildPayload() {
    return {
      home: {
        trustStats: stats.filter((s) => s.value || s.label),
        advantages: advs.filter((a) => a.title || a.description),
      },
      about: {
        intro: intro.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
        factory: factory.filter((f) => f.title || f.text),
        culture,
        image: aboutImage,
      },
      navigation: nav
        .filter((n) => n.label || n.href)
        .map((n) => ({ label: n.label, href: n.href, dropdown: n.dropdown === '1' })),
    };
  }

  return (
    <form action={saveBlocksAction} className="space-y-6">
      <input type="hidden" name="payload" value={JSON.stringify(buildPayload())} />

      <div className="card space-y-6 p-6">
        <p className="text-sm font-bold text-ink">首页 · 信任数据条</p>
        <ArrayField
          title=""
          fields={[
            { key: 'value', label: '数值', placeholder: '15+' },
            { key: 'label', label: '说明', placeholder: 'Years of Experience' },
          ]}
          rows={stats}
          onChange={setStats}
          blank={() => ({ value: '', label: '' })}
          addLabel="＋ 添加数据项"
        />
        <ArrayField
          title="首页 · 企业优势"
          fields={[
            { key: 'title', label: '标题', placeholder: 'Factory Direct Pricing' },
            { key: 'description', label: '描述', placeholder: 'We are a manufacturer…' },
          ]}
          rows={advs}
          onChange={setAdvs}
          blank={() => ({ title: '', description: '' })}
          addLabel="＋ 添加优势"
        />
      </div>

      <div className="card space-y-4 p-6">
        <p className="text-sm font-bold text-ink">关于我们页</p>
        <div>
          <Label className="mb-1 block">公司简介（段落之间空一行）</Label>
          <Textarea rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
        </div>
        <ArrayField
          title="工厂实力三卡"
          fields={[
            { key: 'title', label: '标题', placeholder: 'Production Capacity' },
            { key: 'text', label: '内容', placeholder: 'Machines, lines, monthly output…' },
          ]}
          rows={factory}
          onChange={setFactory}
          blank={() => ({ title: '', text: '' })}
          addLabel="＋ 添加一项"
        />
        <div>
          <Label className="mb-1 block">企业文化</Label>
          <Textarea rows={2} value={culture} onChange={(e) => setCulture(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">配图 URL</Label>
          <Input value={aboutImage} onChange={(e) => setAboutImage(e.target.value)} />
        </div>
      </div>

      <div className="card space-y-6 p-6">
        <p className="text-sm font-bold text-ink">导航菜单</p>
        <ArrayField
          title=""
          fields={[
            { key: 'label', label: '显示名', placeholder: 'Products' },
            { key: 'href', label: '链接', placeholder: '/products' },
            { key: 'dropdown', label: '产品下拉', type: 'bool' },
          ]}
          rows={nav}
          onChange={setNav}
          blank={() => ({ label: '', href: '', dropdown: '' })}
          addLabel="＋ 添加菜单项"
        />
      </div>

      <Button type="submit">保存全部区块</Button>
    </form>
  );
}
