'use client';

import { Button } from '@/components/ui/button';

/**
 * 主题预设试穿器：点击按钮把 4 个品牌变量直接写到 <html> 行内样式上，
 * 全站立即换肤（仅本地预览，刷新即恢复默认；正式换肤见 prompts/ui-swap.md）。
 */
export interface ThemePreset {
  name: string;
  desc: string;
  vars: Record<string, string>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: '工业蓝（默认）',
    desc: '沉稳可信的 B2B 通用蓝',
    vars: {
      '--brand': '224 76% 48%',
      '--brand-dark': '224 76% 33%',
      '--brand-light': '217 91% 60%',
      '--brand-tint': '220 88% 97%',
    },
  },
  {
    name: '活力橙',
    desc: '热情外向的贸易/消费品牌感',
    vars: {
      '--brand': '14 84% 50%',
      '--brand-dark': '11 80% 36%',
      '--brand-light': '18 87% 57%',
      '--brand-tint': '22 92% 95%',
    },
  },
  {
    name: '森林绿',
    desc: '环保、农产品、可持续制造',
    vars: {
      '--brand': '160 84% 30%',
      '--brand-dark': '161 88% 22%',
      '--brand-light': '153 69% 45%',
      '--brand-tint': '152 55% 95%',
    },
  },
  {
    name: '琥珀金',
    desc: '高端、礼品、金属质感行业',
    vars: {
      '--brand': '41 90% 46%',
      '--brand-dark': '36 80% 32%',
      '--brand-light': '45 93% 58%',
      '--brand-tint': '42 80% 95%',
    },
  },
  {
    name: '科技紫',
    desc: '数码、新能源、创新科技感',
    vars: {
      '--brand': '262 83% 58%',
      '--brand-dark': '263 85% 42%',
      '--brand-light': '258 90% 66%',
      '--brand-tint': '260 80% 96%',
    },
  },
];

export default function ThemePresetSwitcher() {
  const apply = (preset: ThemePreset) => {
    const root = document.documentElement;
    Object.entries(preset.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  };
  const reset = () => {
    Object.keys(THEME_PRESETS[0].vars).forEach((k) =>
      document.documentElement.style.removeProperty(k),
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {THEME_PRESETS.map((preset) => (
          <Button key={preset.name} variant="outline" size="sm" onClick={() => apply(preset)}>
            {preset.name}
          </Button>
        ))}
        <Button variant="secondary" size="sm" onClick={reset}>
          恢复默认
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        点击即刻全站生效（按钮/链接/表头/焦点环同步变色），刷新页面恢复默认。正式换肤：把对应 4 个 HSL 值写进
        src/app/globals.css，或直接用手册里的提示词交给 AI 改。
      </p>
    </div>
  );
}
