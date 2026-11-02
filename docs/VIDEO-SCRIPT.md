# 部署演示视频脚本（5 分钟，供录制用）

> 给录制者：全屏录浏览器 + 终端，语速放松，每步停下来 1 秒让观众看清。
> 出镜前准备：GitHub 账号已登录、Turso 账号已登录、Vercel 账号已登录（都提前登好，视频里不出现注册过程）。

## 分镜

**0:00–0:25 开场**
- 台词：「这个开源模板 30 分钟部署一个带后台的外贸独立站，全程不写代码。我们开始。」
- 画面：仓库 GitHub 首页 → 点 Fork

**0:25–1:40 部署 Vercel**
- vercel.com → Add New Project → 选刚 fork 的仓库 → Import
- 滚到 Environment Variables，逐个粘贴 4 个变量（DATABASE_URL / DATABASE_AUTH_TOKEN / SESSION_SECRET / ADMIN_PASSWORD），边贴边念名字
- 点 Deploy，等 1 分钟，出现 Congratulations
- 打开 `xxx.vercel.app`，滚动首页

**1:40–2:30 建 Turso 数据库**
- turso.tech → Create database → 复制 Database URL
- 台词：「为什么需要它？Vercel 的文件系统不持久，这个免费云数据库专门存你后台改的内容」
- （此段也可放到配环境变量之前录，后期剪辑调整顺序）

**2:30–3:50 后台改内容（核心卖点段）**
- 打开 `xxx.vercel.app/admin` → 登录 → **先改密码**（对着镜头强调）
- 产品管理 → 编辑 Product A：改名、换图 URL、改规格行 → 保存
- 切到前台 `/products` → 「看，产品页已经变了」；悬停导航 Products 看下拉同步更新
- 询盘页提交一条测试询盘 → 后台询盘管理看到它 → 状态改为「处理中」

**3:50–4:30 SEO 底牌（差异化段）**
- 打开 `xxx.vercel.app/robots.txt`：「我们显式放行了 GPTBot、ClaudeBot、PerplexityBot——让 ChatGPT 也能推荐你的网站」
- 打开 `/llms.txt`：「这是给 AI 看的网站摘要，产品规格句自动生成」
- 打开 `/sitemap.xml` 扫一眼

**4:30–5:00 收尾 + 钩子**
- 台词：「模板地址在简介里，配套的 AI 工作台能自动同步这些询盘，下个视频见。」
- 画面：GitHub 仓库页 + 关注引导

## 字幕要点（后期加）
- 三路径部署教程见仓库 docs/DEPLOY.md
- 常见报错见 docs/FAQ.md
- 换品牌色只需改 4 个变量（/showcase 演示页可试穿）
