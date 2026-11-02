# 路线图（Roadmap）

> 对应总体规划的 P1–P7 阶段。每阶段完成勾选并附提交记录。
> **v0.1.0 已发布**：https://github.com/kalee777777/AI-Trade-OfficialSite-Admin/releases/tag/v0.1.0

## P7 GitHub 上架（✅ 2026-11-02）

- [x] 公开仓库 <https://github.com/kalee777777/AI-Trade-OfficialSite-Admin>，CI 门禁（泄密审计 + 构建）实测通过
- [x] v0.1.0 Release 发布
- [x] Demo 站机制就绪：`POST /api/demo/reset`（token 鉴权）+ `.github/workflows/demo-reset.yml` 每日 09:00（北京时间）自动重置——部署 Demo 时配好 `DEMO_URL`/`DEMO_RESET_TOKEN` 两个 Secret 与站点同名环境变量即生效
- [x] 修复 CI 实战拦截的冷启动并发问题（SQLITE_BUSY）：cpus:1 串行构建 + busy_timeout/WAL + 种子幂等
- [ ] Demo 站实际部署（Vercel + Turso，配 reset secrets）——待录制课程时执行

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

## P6 文档物料（✅ 2026-11-02 完成）

- [x] 小白部署教程 `docs/DEPLOY.md`：本地 / Vercel+Turso / VPS 三路径 + 上线检查清单 + 数据备份
- [x] 常见报错 FAQ `docs/FAQ.md`：12 类症状-解法对照表
- [x] 架构与二开指南 `docs/EXTEND.md`：目录地图 + 数据流 + 三大常见二开场景
- [x] 部署演示视频分镜脚本 `docs/VIDEO-SCRIPT.md`（5 分钟，供录制）
- [x] **泄密审计门禁**：`scripts/audit-opensource.mjs`（8 类规则扫描 git 全量跟踪文件，0 命中才通过）+ `.github/workflows/audit.yml` CI 强制（push/PR 跑审计 + 构建，红灯禁发）——本地双仓实测 0 命中

## P5 AI 提示词库（✅ 独立站向已随 P1.6 交付）

- [x] `prompts/ui-swap.md`：换肤预设/任意品牌色/圆角风格/组件目录/高频场景（轮播/暗色/加组件/删演示页）/git 兜底/三军规 + `/showcase` 页每组件区附提示词（2026-11-02）

## P3 询盘互通（✅ 2026-11-02 完成，E2E 8/8 通过 · M2 达成）

- [x] `GET /api/sync/inquiries`（契约 v1 全量实现）：X-Api-Key 鉴权 / since+cursor 增量分页 / limit 1–100 / 60 次每小时限流 / 成功访问回写 last_used_at
- [x] Admin API Keys 增强：列表显示「最近同步」时间
- [x] E2E `scripts/e2e-sync.mjs`：签发 Key→提交询盘→全量/增量/分页拉取→无 Key 401→吊销后 403，8 项全过
- [ ] 工作台侧同步客户端（P4 在 AI-Trade-Workbench 实现对接，契约文档两仓同文）

## P1.6 组件演示页 + UI 提示词手册（✅ 2026-11-02，P5 首块提前交付）

- [x] `/showcase` 演示页（noindex + robots disallow）：16 组件实况演示、每区附定制提示词、5 套主题预设一键试穿（ThemePresetSwitcher 直接写 <html> 行内变量，全站即时换肤）
- [x] `prompts/ui-swap.md` 提示词手册：预设换肤/任意品牌色换肤/圆角风格/组件目录/高频场景（轮播/暗色/加组件/删演示页）/git 兜底/下指令三军规
- [x] 效果图预览：`docs/assets/` 7 张（5 预设首页 + 产品详情页 + 演示页全览，playwright 自动生成，`scripts/screenshot-ui.mjs` 可重复执行）

## P2 Admin 后台（✅ 2026-11-02 完成，E2E 9/9 通过）

- [x] 路由组 `(auth)/(panel)`：登录页 + 会话守卫布局（noindex + robots disallow）
- [x] 数据层 Drizzle + @libsql 双模式：本地 `file:data/site.db` / Turso（DATABASE_URL 切换，同一 schema 同一代码）；首次启动自动建表 + 从 seed.json 灌种子（幂等）
- [x] 鉴权：iron-session（7 天 cookie）+ bcrypt 密码哈希存库；ADMIN_PASSWORD 仅作初始密码；默认密码警告横幅
- [x] 仪表盘：产品/询盘/新闻/案例计数 + 新询盘数 + 最近 8 条询盘 + 快捷入口
- [x] 产品管理：列表/上下架/删除 + 编辑页（ProductForm 客户端组件：规格行/FAQ 行 ArrayField 编辑器、描述空行分段、特点一行一条）
- [x] 分类管理 + Banner 管理（服务端表单 ?edit= 预填模式）
- [x] 新闻/案例管理（列表 + 编辑页，关联产品 slug）
- [x] 询盘管理：状态筛选（新/处理中/已回复/已成交/垃圾）/ 行内状态流转 / 删除 / **CSV 导出**（UTF-8 BOM，Excel 友好）
- [x] **API Key 签发/吊销**（sk-site- 前缀，明文仅创建时显示一次——P3 同步用）
- [x] 页面区块：首页信任数据/企业优势 + 关于我们（简介/工厂实力/文化）+ 导航菜单（含产品下拉开关）
- [x] 站点设置：公司信息/联系方式/社交链接/SEO 默认值 + 修改密码
- [x] 前台全面 DB 驱动：content.ts 异步化，Admin 保存 → revalidatePath 全站刷新（ISR，前台静态性能不变）
- [x] E2E 冒烟 `scripts/e2e-admin.mjs`：守卫/登录/建产品/前台可见/询盘落库/后台可见/Key 签发 9 项全过（附 admin 截图 2 张）

## P3 询盘互通（计划 11/12–11/14）

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
