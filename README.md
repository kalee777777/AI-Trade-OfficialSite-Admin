# AI Trade Official Site（带 Admin 后台的外贸独立站模板）

> English: An SEO/GEO-friendly B2B foreign-trade website template with a full Admin panel. Fork, replace placeholders, deploy — no coding needed to go live. (中文文档如下)

一个 **SEO / GEO 友好** 的 B2B 外贸独立站模板，自带完整 Admin 管理后台。面向外贸业务员与中小工厂：拉取模板 → 替换占位内容 → 一键部署，无需写代码即可上线自己的品牌获客站。

配套姊妹项目：**[AI-Trade-Workbench](../AI-Trade-Workbench)**（AI 外贸业务员工作台）——独立站收到的询盘可通过 API 同步进工作台统一跟进（见 `docs/CONTRACT-inquiry-sync.md`）。

---

## ✨ 核心特性

- **开箱即用的外贸站结构**：首页 / 产品（分类+详情）/ 关于 / 案例 / 新闻 / 询盘 / 联系，全站英文（面向海外买家）
- **内置 shadcn/ui 组件库（MIT）**：16 个常用组件源码直接进仓库（Button/表单/Card/Accordion/Sheet/Dialog/Table 等），AI 工具最熟悉，改样式/加组件零门槛；`components.json` 已配好，`npx shadcn@latest add xxx` 可继续追加
- **零代码 Admin 后台**：产品/分类/Banner/新闻/案例/询盘/页面区块/站点设置全部后台可视化修改，**保存即前台同步更新**（ISR）；询盘可筛选、改状态、导出 CSV，并可签发 API Key 给工作台同步
- **SEO 全套内建**：全站 SSG 静态生成、每页独立 meta、自动 sitemap.xml / robots.txt、JSON-LD 结构化数据（Organization / Product / Article / Breadcrumb / FAQ）
- **GEO 前瞻**（让 AI 搜索推荐你）：放行主流 AI 爬虫（GPTBot / ClaudeBot / PerplexityBot…）、自动生成 `llms.txt`、产品页「可直引规格句」区块
- **询盘获客闭环**：智能询盘表单（蜜罐 + 限流防垃圾）→ 落库 → Admin 管理 / CSV 导出 → API 同步到 AI-Trade-Workbench
- **产品数据三处联动**：Admin 改一次产品 → 导航下拉、产品页、询盘表单选项自动更新
- **占位内容规范**：Product A / B / C / D 占位体系，全部标注 `[PLACEHOLDER]`，内置 SVG 占位图零版权风险
- **一键换肤**：品牌色等设计 token 集中在 `globals.css`（HSL 变量），改 4 个变量全站生效（或让 AI 帮你改）

## 🔐 Admin 管理后台

本地跑起来后访问 <http://localhost:3000/admin>：

- **默认密码 `admin123`**（可用 `.env` 的 `ADMIN_PASSWORD` 自定义初始密码）——登录后请立即在「设置 → 修改密码」改掉（密码存数据库，全平台生效）
- **数据库零配置**：首次启动自动建 SQLite 库（`data/site.db`）并灌入模板内容；后台所有修改保存后**前台即时更新**
- **Vercel 部署**：免费版文件系统不持久，需在 [Turso](https://turso.tech)（免费额度）建库后配置 `DATABASE_URL` + `DATABASE_AUTH_TOKEN` 两个环境变量——本地/云端同一套代码
- 后台能力：产品（含规格表/FAQ 嵌套编辑）/ 分类 / Banner / 新闻 / 案例 / **询盘（筛选·状态流转·CSV 导出）** / 页面区块（首页数据/优势/关于/导航菜单）/ 站点设置（公司信息/联系方式/SEO）/ 修改密码 / **API Key 签发**（供 AI-Trade-Workbench 同步询盘）

## 🚀 快速开始（本地）

```bash
git clone <本仓库地址>
cd ai-trade-officialsite-admin
npm install        # 国内网络慢可用: npm install --registry=https://registry.npmmirror.com
npm run dev        # 打开 http://localhost:3000
```

## 📦 部署上线（三选一）

| 方式 | 适合 | 说明 |
|---|---|---|
| **Vercel（推荐）** | 免费上线海外 CDN、免备案 | Fork 仓库 → vercel.com 导入 → 部署完成（P2 起配置一个数据库环境变量即可持久化询盘） |
| VPS / 宝塔 Docker | 自托管 | 有完整 Node 环境即可 `npm run build && npm start` |
| 本地运行 | 学习调试 | `npm run dev` 零配置 |

## 🔄 上线前替换清单（占位 → 真实）

1. `data/seed.json` 里的 `settings`：公司名 / 邮箱 / 电话 / WhatsApp / 地址 / 域名（影响全站 meta 与 canonical）
2. 产品：Product A–D 替换为真实产品（名称/图片/参数/FAQ），或等 Admin 后台（P2）上线后零代码修改
3. `public/placeholders/` 下的 SVG 占位图替换为真实照片
4. 全文搜索 `[PLACEHOLDER]` 确认无遗漏

## 🗺️ 开发路线

- [x] **P1 前台**：7 类页面 + Product A–D 占位 + SEO/GEO 全套 + 询盘 API
- [x] **P1.5 UI 组件库**：shadcn/ui 16 组件内置 + 页面换装 + `/showcase` 演示页
- [x] **P2 Admin 后台**：九大管理页 + 数据库双模式（本地 SQLite / Turso）+ iron-session 鉴权 + CSV 导出 + API Key（E2E 9/9 通过）
- [x] **P3 询盘互通**：`GET /api/sync/inquiries`（Key 鉴权/增量分页/限流），E2E 8/8——AI-Trade-Workbench 可直接对接
- [ ] **P6 完整文档**：小白部署图文教程 / AI 提示词库 / FAQ 手册

## 🤖 用 AI 改站（不用会写代码）

**组件效果预览**：`npm run dev` 后访问 <http://localhost:3000/showcase> —— 全部内置组件实况演示 + 5 套主题风格一键试穿（工业蓝/活力橙/森林绿/琥珀金/科技紫），每个效果旁边就是可复制的定制提示词。

**提示词手册**：[`prompts/ui-swap.md`](prompts/ui-swap.md) —— 换品牌色（改 4 个变量）、换圆角风格、Banner 改轮播、加暗色模式、新增任意 shadcn 组件、改坏了 git 一键还原，全部提示词写好待复制。配套更完整的场景提示词库（开发信/询盘回复等业务向）随课程提供。

## 📚 文档导航

| 文档 | 内容 |
|---|---|
| [部署教程 DEPLOY](docs/DEPLOY.md) | 本地 / Vercel+Turso / VPS 三路径，小白一步步照做 |
| [常见问题 FAQ](docs/FAQ.md) | 安装慢、内容不持久、登录异常等 12 类报错排查 |
| [架构与二开 EXTEND](docs/EXTEND.md) | 目录地图、数据流、加页面/加字段/改同步怎么做 |
| [设计规范 DESIGN](docs/DESIGN.md) | 设计令牌换肤 + 16 个内置组件清单 |
| [同步契约 CONTRACT](docs/CONTRACT-inquiry-sync.md) | 询盘同步 API v1（与工作台仓库同文） |
| [录屏脚本 VIDEO-SCRIPT](docs/VIDEO-SCRIPT.md) | 5 分钟部署演示视频分镜（供录制） |

## 📄 License

MIT — 可免费商用与二次开发。
