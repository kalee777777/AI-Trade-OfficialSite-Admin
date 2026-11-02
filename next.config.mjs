/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 构建期静态生成用单 worker：避免多进程并发初始化本地 SQLite（SQLITE_BUSY）。
  // 本模板仅 30+ 页，串行构建代价可忽略，换来跨环境稳定。
  cpus: 1,
};

export default nextConfig;
