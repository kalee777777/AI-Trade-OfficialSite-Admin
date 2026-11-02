# 常见问题与报错排查（FAQ）

| 症状 | 原因与解法 |
|---|---|
| `npm install` 很慢或超时 | 走国内镜像：`npm install --registry=https://registry.npmmirror.com`（见 DEPLOY.md） |
| `EADDRINUSE: port 3000 already in use` | 端口被占：`npx next dev -p 3001` 换端口，或结束占用进程 |
| Vercel 上 Admin 改的内容**刷新后就丢** | 没配数据库。Vercel 文件系统不持久——按 DEPLOY.md 路径 B 配好 `DATABASE_URL` + `DATABASE_AUTH_TOKEN`（Turso 免费额度）后重新部署 |
| 后台登录后过一会又要登录 / 两台电脑互相踢 | 没配 `SESSION_SECRET` 或换过值。在 Vercel/`.env.local` 固定配置一个 32 位以上随机串 |
| 页面 canonical / sitemap 里的域名是 example.com | 后台「站点设置 → 站点域名」改成你的真实域名 |
| 忘记后台密码 | `.env` 设 `ADMIN_PASSWORD=新密码` 并**删除本地 data/site.db 中的 settings 行**？——更简单：本地模式删掉 `data/site.db` 重来（会重灌模板内容）；Turso 模式在 Turso 控制台执行 `DELETE FROM settings WHERE key='admin_password'` 后重启，即可用 `ADMIN_PASSWORD`（或默认 admin123）重新登录 |
| 构建报 `The xxx class does not exist` | 自定义 CSS 变量色不能带透明度斜杠（如 `bg-brand/20`）。用实色类或参照 tailwind.config.ts 的 `<alpha-value>` 模式 |
| 询盘提交后后台看不到 | ① 检查是否在「垃圾」筛选里；② Vercel 未配数据库时提交会失败（Network error）——配 Turso；③ 提交过快（<2 秒）会被防垃圾机制静默丢弃，属正常 |
| 导出的 CSV 中文乱码 | 已内置 UTF-8 BOM；用新版 Excel / WPS 打开，别用记事本另存 |
| 改了 seed.json 但网站没变化 | seed 只在**首次建库**时灌入。之后的修改请走 Admin 后台（或删 `data/site.db` 重新初始化） |
| `git push` 后 Vercel 没更新 | Vercel 按仓库自动部署，看项目 Deployments 日志；本地测试记得先 `npm run build` 确认无报错 |
| Lighthouse 分数低 | 多半是产品图太大：把真实图片压到 200KB 内再传（TinyPNG 等）；模板自带 SVG 占位图不影响分数 |
