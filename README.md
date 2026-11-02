# AI Trade Official Site（带 Admin 后台的外贸独立站模板）

> English: An SEO/GEO-friendly B2B foreign-trade website template with a full Admin panel. Fork, replace placeholders, deploy — no coding needed to go live. (中文文档如下)

一个 **SEO / GEO 友好** 的 B2B 外贸独立站模板，自带完整 Admin 管理后台。面向外贸业务员与中小工厂：拉取模板 → 替换占位内容 → 一键部署，无需写代码即可上线自己的品牌获客站。

配套姊妹项目：**[AI-Trade-Workbench](../AI-Trade-Workbench)**（AI 外贸业务员工作台）——独立站收到的询盘可通过 API 同步进工作台统一跟进（见 `docs/CONTRACT-inquiry-sync.md`）。

---

## ✨ 核心特性

- **开箱即用的外贸站结构**：首页 / 产品（分类+详情）/ 关于 / 案例 / 新闻 / 询盘 / 联系，全站英文（面向海外买家）
- **零代码 Admin 后台**（P2 开发中）：产品 / 询盘 / 内容 / 站点设置全部后台可视化修改
- **SEO 全套内建**：全站 SSG 静态生成、每页独立 meta、自动 sitemap.xml / robots.txt、JSON-LD 结构化数据（Organization / Product / Article / Breadcrumb / FAQ）
- **GEO 前瞻**（让 AI 搜索推荐你）：放行主流 AI 爬虫（GPTBot / ClaudeBot / PerplexityBot…）、自动生成 `llms.txt`、产品页「可直引规格句」区块
- **询盘获客闭环**：智能询盘表单（蜜罐 + 限流防垃圾）→ 落库 → Admin 管理 / CSV 导出 → API 同步到 AI-Trade-Workbench
- **产品数据三处联动**：Admin 改一次产品 → 导航下拉、产品页、询盘表单选项自动更新
- **占位内容规范**：Product A / B / C / D 占位体系，全部标注 `[PLACEHOLDER]`，内置 SVG 占位图零版权风险
- **一键换肤**：品牌色等设计 token 集中在 `globals.css`，改 4 个变量全站生效（或让 AI 帮你改）

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
- [ ] **P2 Admin 后台**：六系统（仪表盘/产品/询盘/内容/设置/账号）+ 数据库双模式（本地 SQLite / Turso）
- [ ] **P3 询盘互通**：`/api/sync/inquiries` + API Key 管理，对接 AI-Trade-Workbench 自动同步
- [ ] **P6 完整文档**：小白部署图文教程 / AI 提示词库 / FAQ 手册

## 🤖 用 AI 改站（不用会写代码）

仓库内置全套 AI 修改提示词（P5 阶段提供 `prompts/` 目录）：换品牌色、批量替换产品文案、新增页面、SEO 优化——把提示词丢给 CodeX / WorkBuddy / Trae 即可。

## 📄 License

MIT — 可免费商用与二次开发。
