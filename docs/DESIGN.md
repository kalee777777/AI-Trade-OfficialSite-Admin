# 设计规范（Design Tokens）

> 本模板的设计变量全部集中在 `src/app/globals.css` 的 `:root`。**换品牌 = 只改这一块**，无需碰任何组件代码。

## 品牌色（默认：工业蓝）

| 变量 | 默认值 | 用途 |
|---|---|---|
| `--brand` | `#1d4ed8` | 主品牌色：按钮、链接、强调、表头 |
| `--brand-dark` | `#1e3a8a` | 深一档：悬停态、页脚深底 |
| `--brand-light` | `#3b82f6` | 亮一档：eyebrow 小标题、次级强调 |
| `--brand-tint` | `#eff4fe` | 浅底：区块背景、标签底、占位图底 |

### 换肤示例（改 4 行即可）

```css
:root {
  --brand: #e44824;        /* 换成你的品牌橙 */
  --brand-dark: #a8300c;
  --brand-light: #f0662e;
  --brand-tint: #fdeede;
}
```

改完后：按钮、导航悬停、页脚、产品下拉、表头、CTA、FAQ 边框……全站同步变色。

## 中性色

| 变量 | 默认值 | 用途 |
|---|---|---|
| `--ink` | `#111827` | 正文墨色 |
| `--paper` | `#ffffff` | 页面底色 |
| `--muted` | `#6b7280` | 次级文字 |
| `--line` | `#e5e7eb` | 分隔线、边框 |

## 字体

系统字体栈（`-apple-system / Segoe UI / Roboto / PingFang SC / Microsoft YaHei`）——零外部请求、无构建时网络依赖、中文环境自动回退。无需配置。

## 复用类（Tailwind components 层）

| 类名 | 用途 |
|---|---|
| `.container-x` | 页面主容器（max-w-7xl + 响应式 padding） |
| `.btn-primary` / `.btn-outline` | 主/次按钮 |
| `.section-eyebrow` / `.section-title` | 区块小标题 / 大标题 |
| `.card` / `.field` / `.table-spec` | 卡片 / 表单输入 / 规格表 |

## 占位内容规范

- 所有待替换文案统一标注 `[PLACEHOLDER]` 前缀（上线前全文搜索清零）
- 图片占位：`public/placeholders/*.svg`（自产 SVG，零版权）
- 产品占位：Category A（Product A/B）+ Category B（Product C/D）
