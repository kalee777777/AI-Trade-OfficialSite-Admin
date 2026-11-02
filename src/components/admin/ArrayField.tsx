'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ArrayFieldSpec {
  key: string;
  label: string;
  placeholder?: string;
  /** bool 渲染为勾选框（值 '1' / ''） */
  type?: 'text' | 'bool';
}

type Row = Record<string, string>;

/**
 * 通用「多行编辑器」：产品规格/FAQ、首页数据条/优势、社交链接、导航菜单等嵌套列表共用。
 * 受控组件——由外层表单持有 rows 状态，序列化进 payload 提交。
 */
export default function ArrayField({
  title,
  fields,
  rows,
  onChange,
  blank,
  addLabel = '＋ 添加一行',
}: {
  title: string;
  fields: ArrayFieldSpec[];
  rows: Row[];
  onChange: (rows: Row[]) => void;
  blank: () => Row;
  addLabel?: string;
}) {
  function update(i: number, key: string, value: string) {
    const next = rows.map((row, idx) => (idx === i ? { ...row, [key]: value } : row));
    onChange(next);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink">{title}</p>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2 rounded-md border border-line bg-muted/40 p-3">
            {fields.map((f) => (
              <div key={f.key} className="min-w-[140px] flex-1">
                {f.type !== 'bool' && (
                  <Label className="mb-1 block text-xs text-muted-foreground">{f.label}</Label>
                )}
                {f.type === 'bool' ? (
                  <label className="flex items-center gap-2 text-xs text-ink">
                    <input
                      type="checkbox"
                      checked={row[f.key] === '1'}
                      onChange={(e) => update(i, f.key, e.target.checked ? '1' : '')}
                    />
                    {f.label}
                  </label>
                ) : (
                  <Input
                    value={row[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    className="h-9 bg-paper"
                  />
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
            >
              删除
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => onChange([...rows, blank()])}>
        {addLabel}
      </Button>
    </div>
  );
}
