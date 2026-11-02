# 设计规范（Design Tokens + UI 组件库）

> 两层体系：**Design Tokens**（`src/app/globals.css`，HSL 变量）+ **shadcn/ui 组件库**（`src/components/ui/`，MIT）。
> **换品牌 = 只改 globals.css 里 4 个 `--brand*` 变量**，自定义页面与 shadcn 组件同步生效。

## 品牌色（HSL 空格三元组，默认工业蓝）

| 变量 | 默认值（HSL） | 对应 HEX | 用途 |
|---|---|---|---|
| `--brand` | `224 76% 48%` | `#1d4ed8` | 主品牌色：按钮(bg-primary)、链接、强调 |
| `--brand-dark` | `224 76% 33%` | `#1e3a8a` | 深一档：悬停、页脚深底 |
| `--brand-light` | `217 91% 60%` | `#3b82f6` | 亮一档：eyebrow 小标题、ring 焦点环 |
| `--brand-tint` | `220 88% 97%` | `#eff4fe` | 浅底：区块背景(accent)、Badge 底 |

### 换肤示例（改 4 行即可，HSL 用 [hslpicker.com](https://hslpicker.com) 查）

```css
:root {
  --brand: 14 84% 50%;        /* 换成品牌橙 #e44824 */
  --brand-dark: 11 80% 36%;
  --brand-light: 18 87% 57%;
  --brand-tint: 22 92% 95%;
}
```

## 语义色（shadcn 约定，组件库引用）

`--primary` / `--secondary` / `--muted` / `--accent` / `--destructive` / `--border` / `--input` / `--ring` / `--card` / `--popover`（各带 `-foreground` 变体）。其中 `--primary`=`--brand`、`--accent`=`--brand-tint`、`--ring`=`--brand-light` 已接到品牌色——**shadcn 组件自动跟随品牌换肤**。

中性色：`--ink`（正文 `#111827`）、`--paper`（底 `#fff`）、`--line`（边框 `#e5e7eb`）、`--muted-foreground`（次级文字 `#6b7280`）。

> 透明度修饰符可用（如 `bg-primary/90`）——颜色全部按 `hsl(var(--x) / <alpha-value>)` 模式映射。

## 字体

系统字体栈——零外部请求、无构建网络依赖、中文自动回退。

## UI 组件库（shadcn/ui · MIT · 16 个已内置）

组件源码在 `src/components/ui/`（非 npm 依赖，直接可读可改，AI 工具均熟悉）：

| 组件 | 文件 | 当前用途 |
|---|---|---|
| Button | `button.tsx` | 全站 CTA（asChild 可包 Link/a） |
| Input / Textarea / Label | `input/textarea/label.tsx` | 询盘表单；P2 Admin 全部表单 |
| Select | `select.tsx` | P2 Admin（前台询盘用原生 select：移动端体验+optgroup） |
| Card | `card.tsx` | 产品卡、信任卡片区 |
| Badge | `badge.tsx` | 产品页分类标签 |
| Table | `table.tsx` | 产品规格表；P2 Admin 数据表 |
| Accordion | `accordion.tsx` | 产品 FAQ（无障碍+动画，内容保留在 DOM 不伤 SEO）；移动导航产品分组 |
| Sheet | `sheet.tsx` | 移动端侧边导航抽屉 |
| Dialog | `dialog.tsx` | 预置（P2 Admin 确认弹窗） |
| DropdownMenu | `dropdown-menu.tsx` | 预置（P2 Admin 行操作菜单） |
| Tabs | `tabs.tsx` | 预置（产品页规格/特点切换可扩展） |
| Breadcrumb | `breadcrumb.tsx` | 详情页面包屑 |
| Separator / Skeleton | `separator/skeleton.tsx` | 预置（P2 Admin 加载态） |

**扩展更多组件**：仓库已带 `components.json`（shadcn CLI 配置），可 `npx shadcn@latest add <组件>` 按需追加，或让 AI 按 ui/ 目录现有代码风格直接生成。

## 页面复用类（Tailwind components 层）

| 类名 | 用途 |
|---|---|
| `.container-x` | 页面主容器（max-w-7xl + 响应式 padding） |
| `.section-eyebrow` / `.section-title` | 区块小标题 / 大标题 |
| `.card` | 简单卡片底（div 场景；结构化场景用 ui/Card） |
| `.field` | 原生 select 等的输入框样式（与 ui/Input 视觉一致） |

## 占位内容规范

- 所有待替换文案统一标注 `[PLACEHOLDER]` 前缀（上线前全文搜索清零）
- 图片占位：`public/placeholders/*.svg`（自产 SVG，零版权）
- 产品占位：Category A（Product A/B）+ Category B（Product C/D）
