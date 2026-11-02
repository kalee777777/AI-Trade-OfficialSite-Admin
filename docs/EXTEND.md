# 架构与二次开发指南

> 给想深入定制的同学（以及 AI 助手）：5 分钟看懂这个项目怎么运转、往哪里下刀。

## 目录地图

```
AI-Trade-OfficialSite-Admin/
├── data/
│   ├── seed.json          # 模板内容（首次建库的种子；之后的修改走 Admin 后台）
│   └── site.db            # 本地 SQLite（运行时自动生成，gitignore）
├── src/
│   ├── app/               # 页面（Next.js App Router）
│   │   ├── page.tsx           # 首页
│   │   ├── products/[slug]/   # 产品详情（SEO 核心：JSON-LD + Quick Spec）
│   │   ├── inquiry/ contact/  # 询盘表单 / 联系页
│   │   ├── admin/             # 后台（(auth) 登录组 + (panel) 守卫组）
│   │   ├── api/inquiries/     # 询盘提交（防垃圾三件套）
│   │   ├── api/sync/inquiries/# 工作台同步端点（X-Api-Key）
│   │   ├── sitemap.ts robots.ts llms.txt/   # SEO/GEO 三件套
│   │   └── showcase/          # 组件演示页（可删）
│   ├── components/        # 业务组件 + ui/（shadcn 组件库 16 个）
│   ├── db/                # Drizzle schema + 建表 DDL + 自动种子
│   └── lib/               # content.ts（内容读取层）/ session / actions（Server Actions）
└── docs/                  # 你正在看的文档
```

## 数据流（一句话版）

**Admin 后台 → 数据库（SQLite/Turso）→ content.ts 读取 → 前台 SSG 页面；后台保存时 revalidatePath 全站刷新。**

三个关键约定：

1. **产品数据三处联动**：导航下拉、产品页、询盘表单选项都来自同一张 `products` 表——后台改一次全站生效
2. **颜色全部走 4 个 CSS 变量**（`globals.css` 的 `--brand*`），shadcn 组件的 primary/accent/ring 已接上——换肤无死角
3. **所有写操作都是 Server Actions**（`src/lib/actions/`），没有独立后端——新增管理功能=加一个 action + 一个表单

## 常见二开场景

**加一个前台页面**：`src/app/<路径>/page.tsx` 建服务端组件（从 content.ts 取数）→ 后台「页面区块」加可编辑内容（settings 表加一个 JSON 行 + BlocksForm 加一段）→ sitemap.ts 补一行。

**给产品加字段**：`db/schema.ts` 加列（同步补 `db/ddl.ts`）→ `lib/types.ts` 加字段 → `components/admin/ProductForm.tsx` 加输入 → 详情页渲染。已有库需手动 `ALTER TABLE` 或删 `data/site.db` 重建（Turso 用 `turso db shell` 执行 DDL）。

**加一个 shadcn 组件**：`npx shadcn@latest add <name>`；CLI 不可用就让 AI 按 `src/components/ui/` 现有风格手写（见 prompts/ui-swap.md）。

**改同步行为**：契约在 `docs/CONTRACT-inquiry-sync.md`（工作台仓库同文），端点在 `src/app/api/sync/inquiries/route.ts`——动契约必须两边一起改并升版本号。
