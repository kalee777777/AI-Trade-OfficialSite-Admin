# 部署教程（小白版）

> 目标：不会写代码也能把外贸独立站跑起来并上线。三条路径按需选一。
> 常见报错先看 [FAQ](./FAQ.md)。

## 路径 A：本地运行（学习/改内容用，10 分钟）

```bash
# 1. 安装 Node.js 20+（https://nodejs.org 下载 LTS 版，一路下一步）
node -v   # 终端里能打印 v20.x / v22.x 即可

# 2. 克隆并安装
git clone https://github.com/<你的用户名>/AI-Trade-OfficialSite-Admin.git
cd AI-Trade-OfficialSite-Admin
npm install        # 国内网络慢用：npm install --registry=https://registry.npmmirror.com

# 3. 启动
npm run dev        # 打开 http://localhost:3000
```

首次启动会自动建本地数据库并灌入模板内容。后台：`http://localhost:3000/admin`，默认密码 `admin123`。

## 路径 B：Vercel + Turso 免费上线（推荐，30 分钟，免备案海外 CDN）

**为什么两条腿**：Vercel 免费托管网站，但它的文件系统不持久（Admin 改的内容会丢）；Turso 提供免费云数据库专门存内容。各取所长。

1. **传到 GitHub**：注册 GitHub → New repository（命名如 `officialsite`，Public）→ 把本地项目 push 上去（或用 GitHub 网页上传）
2. **建 Turso 数据库**（免费）：
   - 注册 <https://turso.tech> → Create database（名字随意，如 `mysite`）
   - 拿到两个值：`Database URL`（形如 `libsql://mysite-xxx.turso.io`）和 `Auth Token`（Settings → Tokens 创建）
3. **部署到 Vercel**（免费）：
   - 注册 <https://vercel.com>（用 GitHub 账号登录）→ Add New Project → 选中刚才的仓库 → Import
   - **Environment Variables** 里加 4 个变量（Production 和 Preview 都勾）：

     | 变量名 | 值 |
     |---|---|
     | `DATABASE_URL` | Turso 的 Database URL |
     | `DATABASE_AUTH_TOKEN` | Turso 的 Auth Token |
     | `SESSION_SECRET` | 随便一串 32 位以上字符（密码生成器复制一个） |
     | `ADMIN_PASSWORD` | 你的后台初始密码（不设则默认 admin123） |

   - 点 Deploy → 1-2 分钟后拿到 `xxx.vercel.app` 域名，直接可访问
4. **首次初始化**：打开 `https://xxx.vercel.app/admin` 用初始密码登录 → **立即去「设置 → 修改密码」**
5. **绑自己的域名**（可选）：Vercel 项目 → Settings → Domains → 添加域名 → 按提示去域名商加 CNAME 记录

## 路径 C：VPS / 宝塔自托管（已有服务器的同学）

```bash
# 服务器装 Node 20+ 后：
git clone https://github.com/<你>/AI-Trade-OfficialSite-Admin.git
cd AI-Trade-OfficialSite-Admin
npm ci
npm run build
PORT=8080 npm start          # 默认 3000，可改
```

常驻进程用 pm2：`npm i -g pm2 && pm2 start npm --name site -- start`；Nginx 反代到 8080 + certbot 上 HTTPS。
自托管模式数据库走本地 SQLite 文件 `data/site.db`，**记得定期备份这个文件**。

## 上线前检查清单

- [ ] 全文搜索 `[PLACEHOLDER]` 清零（产品/公司信息都已在后台改掉）
- [ ] 「站点设置」里的域名已改成真实域名（影响 canonical/OG/sitemap）
- [ ] 后台密码已修改（不再用 admin123）
- [ ] 每个产品的 Quick Spec / FAQ 已填真实内容（SEO/GEO 直接用它们）
- [ ] （可选）删除组件演示页：对 AI 说「移除 src/app/showcase 目录」

## 数据备份

- Turso 模式：内容在云端，Turso 控制台可导出；询盘可随时在后台「导出 CSV」
- 自托管模式：备份 `data/site.db` 文件即可（scp 到本地/定时任务）
