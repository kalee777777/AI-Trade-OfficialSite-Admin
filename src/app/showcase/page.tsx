import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ThemePresetSwitcher from '@/components/showcase/ThemePresetSwitcher';
import {
  AccordionDemo, DialogDemo, DropdownDemo, FormDemo, SelectDemo, SheetDemo, TabsDemo,
} from '@/components/showcase/InteractiveDemos';

export const metadata: Metadata = {
  title: 'Component Showcase',
  description: 'Live preview of all built-in UI components and theme presets.',
  robots: { index: false, follow: false }, // 演示页不进搜索引擎
};

/** 提示词展示块 */
function PromptBlock({ children }: { children: string }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand">提示词（复制给 CodeX / Trae / WorkBuddy）</p>
      <pre className="card overflow-x-auto p-4 text-xs leading-relaxed text-muted-foreground">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Section({ id, title, desc, children }: { id: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="card mt-5 p-6">{children}</div>
    </section>
  );
}

/** 组件演示页：所有内置组件的活效果 + 对应定制提示词。上线可整目录删除（见手册）。 */
export default function ShowcasePage() {
  return (
    <div className="container-x py-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Component Showcase</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-extrabold text-ink">UI 组件演示 &amp; 换肤试穿</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        本页集中展示模板内置的全部 16 个组件（shadcn/ui · MIT）与 5 套主题预设的真实效果。
        每个区块下方附「可复制的定制提示词」——学员想改任何效果，把提示词粘给 CodeX / Trae / WorkBuddy 即可。
        配套手册：<code className="rounded bg-muted px-1.5 py-0.5 text-xs">prompts/ui-swap.md</code>。
        本页已设置 noindex，不进搜索引擎；正式上线后可整目录删除（见手册末节）。
      </p>

      {/* ===== 主题预设 ===== */}
      <Section
        id="theme"
        title="① 主题预设（整站换肤）"
        desc="点击按钮即刻试穿 5 套风格——全站按钮/链接/表头/焦点环同步变色。选中后可去首页/产品页看整体效果，刷新恢复默认。"
      >
        <ThemePresetSwitcher />
        <PromptBlock>{`把本站品牌色换成活力橙风格：打开 src/app/globals.css，把 :root 里的 4 个变量改为——
--brand: 14 84% 50%;
--brand-dark: 11 80% 36%;
--brand-light: 18 87% 57%;
--brand-tint: 22 92% 95%;
只改这 4 行，其他内容一律不动，改完等我浏览器确认。`}</PromptBlock>
      </Section>

      {/* ===== Button & Badge ===== */}
      <Section id="button" title="② Button 按钮 / Badge 标签" desc="6 种按钮变体 × 4 种尺寸；Badge 用于分类标签、状态标签。全站 CTA 已在用。">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="brand">Category A</Badge>
          <Badge variant="destructive">Expired</Badge>
        </div>
        <PromptBlock>{`修改 src/components/ui/button.tsx 的 default 变体：把 bg-primary hover:bg-primary/90 改为
bg-gradient-to-r from-brand-dark to-brand hover:opacity-90，实现品牌色渐变按钮。只改 default 变体，其他变体不动。`}</PromptBlock>
      </Section>

      {/* ===== 表单 ===== */}
      <Section id="form" title="③ 表单件 Input / Textarea / Label / Select" desc="询盘表单同款。聚焦时品牌色描边 + 光环（--ring 已接品牌色）。">
        <FormDemo />
        <div className="mt-6">
          <SelectDemo />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          注：前台询盘表单的产品下拉用原生 select（移动端体验 + optgroup 分组）；ui/Select（上方案例）供 Admin 后台使用。
        </p>
        <PromptBlock>{`把询盘表单的必填项输入框在未通过校验时显示红色边框：修改 src/components/InquiryForm.tsx，
用原生 HTML 校验（form onSubmit 前检查 e.target.checkValidity()，失败时给对应 Input 加 aria-invalid="true"），
并给 src/components/ui/input.tsx 增加 aria-invalid:border-destructive aria-invalid:ring-destructive/30 两个类。`}</PromptBlock>
      </Section>

      {/* ===== Card ===== */}
      <Section id="card" title="④ Card 卡片" desc="产品卡、信任卡片区同款；带标题/描述/内容/页脚四个插槽。">
        <div className="grid max-w-md gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Card</CardTitle>
              <CardDescription>首页产品宫格与相关产品用的是这个结构</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Card content — image area + title + tagline + link.
            </CardContent>
          </Card>
        </div>
        <PromptBlock>{`把产品卡片（src/components/ProductCard.tsx）在鼠标悬停时改为上浮效果：
给 Card 增加 transition-transform duration-300 hover:-translate-y-1 类，替换现有的 hover:shadow-lg。`}</PromptBlock>
      </Section>

      {/* ===== Table ===== */}
      <Section id="table" title="⑤ Table 规格表" desc="产品详情页参数表同款；Admin 后台的数据列表将复用此组件。">
        <div className="card max-w-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-accent">Parameter</TableHead>
                <TableHead className="bg-accent">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Material</TableCell>
                <TableCell className="text-muted-foreground">Q235B steel</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">MOQ</TableCell>
                <TableCell className="text-muted-foreground">200 units</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <PromptBlock>{`给产品规格表（src/app/products/[slug]/page.tsx 的 Specifications 区块）增加斑马纹：
给 TableBody 里的 TableRow 加 odd:bg-muted/40 类（奇数行浅灰底）。`}</PromptBlock>
      </Section>

      {/* ===== Accordion ===== */}
      <Section id="accordion" title="⑥ Accordion 手风琴" desc="产品页 FAQ 同款：无障碍键盘操作 + 平滑展开动画，内容保留在 HTML 中不影响 SEO。">
        <AccordionDemo />
        <PromptBlock>{`把产品页 FAQ 手风琴改为默认展开第一项：修改 src/components/FaqAccordion.tsx，
把 Accordion 的 type="single" collapsible 改为 defaultValue="faq-0"。`}</PromptBlock>
      </Section>

      {/* ===== Tabs ===== */}
      <Section id="tabs" title="⑦ Tabs 标签页" desc="预置组件：可把产品详情的规格/特点/FAQ 收进标签页切换，缩短长页面。">
        <TabsDemo />
        <PromptBlock>{`把产品详情页（src/app/products/[slug]/page.tsx）的 Specifications / Key Features / FAQ
三个区块改造成 shadcn/ui Tabs 标签页切换（用 src/components/ui/tabs.tsx，参考 /showcase 页效果），
要求：默认显示 Specifications；FAQ 的 JSON-LD 与语义内容保持不变（内容仍在 DOM 中渲染）。`}</PromptBlock>
      </Section>

      {/* ===== Dialog / Sheet / Dropdown ===== */}
      <Section id="overlays" title="⑧ Dialog 对话框 / Sheet 侧边抽屉 / DropdownMenu 下拉菜单" desc="移动端导航抽屉已在用；Dialog 与 DropdownMenu 为 Admin 后台预置（确认弹窗、行操作菜单）。">
        <div className="flex flex-wrap gap-3">
          <DialogDemo />
          <SheetDemo />
          <DropdownDemo />
        </div>
        <PromptBlock>{`给产品详情页加一个「Request Callback」对话框：用 src/components/ui/dialog.tsx（参考 /showcase 页 DialogDemo），
在 src/app/products/[slug]/page.tsx 的询盘按钮旁新增一个 Dialog 触发按钮，内容为简单表单（name / email / preferred time），
提交直接 POST /api/inquiries，source 填 "callback-dialog"。`}</PromptBlock>
      </Section>

      {/* ===== Skeleton / Separator ===== */}
      <Section id="misc" title="⑨ Skeleton 加载占位 / Separator 分隔线" desc="Admin 后台加载态预置；Separator 用于内容分隔。">
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">Separator 上方是 Skeleton 加载占位示例</p>
        </div>
        <PromptBlock>{`用 shadcn/ui 官方注册表给本项目添加更多组件，例如：npx shadcn@latest add carousel toast。
如果 CLI 不可用，请按 src/components/ui/ 现有组件的代码风格（cn() + tailwind + radix 原语）手写实现，
并在 docs/DESIGN.md 的组件清单里补一行。`}</PromptBlock>
      </Section>

      {/* ===== Breadcrumb ===== */}
      <Section id="breadcrumb" title="⑩ Breadcrumb 面包屑" desc="详情页导航路径同款（页面同时输出 BreadcrumbList JSON-LD，两套互不影响）。">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/products">Products</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Product A</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <PromptBlock>{`把全站圆角风格从默认 0.5rem 改为大圆角 0.9rem：只改 src/app/globals.css 里的 --radius 一个变量，
按钮/卡片/输入框会自动跟随（tailwind.config.ts 的 borderRadius 已映射到该变量）。`}</PromptBlock>
      </Section>

      <p className="mt-16 text-xs text-muted-foreground">
        想删除本演示页？对 AI 说：「删除模板自带的组件演示页：移除 src/app/showcase 目录，不影响其他页面。」
      </p>
    </div>
  );
}
