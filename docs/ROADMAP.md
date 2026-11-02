# 路线图（Roadmap）

> 对应总体规划的 P1–P7 阶段。每阶段完成勾选并附提交记录。

## P1 独立站前台（✅ 2026-11-02）

- [x] Next.js 14 + TypeScript + Tailwind 骨架，design tokens 集中管理
- [x] 7 类页面：首页 / 产品列表 / 产品详情 / 关于 / 案例（列表+详情）/ 新闻（列表+详情）/ 询盘 / 联系 / 404
- [x] Product A–D 占位体系：导航下拉 / 产品页 / 询盘表单三处同源联动
- [x] SEO 全套：SSG、每页独立 meta+canonical+OG、自动 sitemap.xml / robots.txt、JSON-LD（Organization/Product/Article/Breadcrumb/FAQ）
- [x] GEO：AI 爬虫放行、`/llms.txt` 自动生成、产品页可直引规格句
- [x] 询盘表单（蜜罐+耗时+限流防垃圾）+ `POST /api/inquiries` 本地落盘
- [x] 全部占位内容标注 `[PLACEHOLDER]`，SVG 占位图自产

## P1.5 UI 组件库内置（✅ 2026-11-02，应用户需求在 P2 前插入）

- [x] shadcn/ui 基座：HSL token 体系（品牌色/语义色统一）、cn() 工具、components.json（CLI 可追加组件）、tailwindcss-animate
- [x] 16 个组件进仓库：button / input / textarea / label / select / badge / card / accordion / tabs / dialog / sheet / dropdown-menu / table / breadcrumb / separator / skeleton
- [x] 页面换装：全站 CTA→Button、询盘表单→Input/Textarea/Label、FAQ→Accordion（无障碍+动画，SEO 不受影响）、移动导航→Sheet 侧边抽屉、规格表→Table、产品卡→Card、面包屑→shadcn Breadcrumb
- [x] 全局语义对齐：text-muted → text-muted-foreground（shadcn 约定，AI 生成代码零适配）
- [x] 回归：build 22 页全静态、JSON-LD 4 块完好、询盘 API/蜜罐正常

## P2 Admin 后台（进行中 → 计划 11/08–11/12）

- [ ] `/admin` 路由组（noindex）+ iron-session 鉴权（ADMIN_PASSWORD）
- [ ] 数据层 Drizzle ORM 双模式（本地 SQLite / Turso，同 schema 同代码）
- [ ] 仪表盘：询盘趋势 / 最近询盘
- [ ] 产品管理：CRUD / 分类 / 参数表 / 上下架 / slug
- [ ] 询盘管理：筛选 / 状态流转 / CSV 导出 / **API Key 签发吊销**
- [ ] 内容管理：新闻 / 案例 / Banner / 页面区块 / FAQ
- [ ] 站点设置：Logo / 公司信息 / 联系方式 / 导航菜单 / SEO 默认值

## P3 询盘互通（计划 11/12–11/14）

- [ ] `GET /api/sync/inquiries`（契约见 CONTRACT-inquiry-sync.md）+ 限流
- [ ] 与 AI-Trade-Workbench 同步客户端联调（M2 验收：E2E 打通）

## P5 AI 提示词库（计划 11/17–21）

- [ ] `prompts/` 目录：独立站向 8 条（换肤 / 产品文案批量替换 / 新增页面 / SEO 优化…）

## P6 文档物料（计划 11/20–25）

- [ ] 小白部署图文教程（Vercel / 自托管 / 本地三路径）
- [ ] 常见报错 FAQ 手册
- [ ] 二次开发指南
