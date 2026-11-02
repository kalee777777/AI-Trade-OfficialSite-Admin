/**
 * Admin E2E 冒烟：登录守卫 → 登录 → 新建产品 → 前台可见 → 询盘 API 落库 → 后台可见。
 * 用法（服务器跑在 :3000，默认密码 admin123）：
 *   node scripts/e2e-admin.mjs
 * playwright 解析顺序：本仓库依赖 → 环境变量 PLAYWRIGHT_FROM 指向已有 playwright 项目 package.json。
 */
import { createRequire } from 'node:module';

const localRequire = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = localRequire('playwright'));
} catch {
  if (process.env.PLAYWRIGHT_FROM) {
    ({ chromium } = createRequire(process.env.PLAYWRIGHT_FROM)('playwright'));
  } else {
    console.error('缺少 playwright：npm i -D playwright && npx playwright install chromium，或设 PLAYWRIGHT_FROM=<已有项目>/package.json');
    process.exit(1);
  }
}

const BASE = process.env.E2E_BASE || 'http://localhost:3000';
const results = [];
function check(name, ok) {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}`);
}

async function main() {
  const browser = await chromium.launch();

  // --- 未登录访问 /admin 应跳登录页 ---
  const anon = await browser.newPage();
  await anon.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  check('守卫：未登录跳转 /admin/login', anon.url().includes('/admin/login'));
  await anon.close();

  // --- 登录 → 仪表盘 ---
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
  await page.fill('#password', 'admin123');
  await page.click('button[type=submit]');
  await page.waitForURL('**/admin', { timeout: 15000 });
  check('登录：默认密码进入仪表盘', (await page.textContent('h1'))?.includes('仪表盘'));
  const bodyText = await page.textContent('body');
  check('仪表盘：默认密码警告可见', bodyText.includes('admin123'));
  await page.screenshot({ path: 'docs/assets/admin-dashboard.png', clip: { x: 0, y: 0, width: 1440, height: 860 } });

  // --- 新建产品 ---
  await page.goto(`${BASE}/admin/products/new`, { waitUntil: 'networkidle' });
  await page.fill('input[placeholder="e.g. Welded Wire Mesh"]', 'E2E Test Product');
  await page.fill('input[placeholder="e.g. welded-wire-mesh"]', 'e2e-test-product');
  await page.click('button[type=submit]:has-text("保存产品")');
  await page.waitForURL('**/admin/products?saved=1', { timeout: 15000 });
  check('产品：保存成功回列表', true);
  check('产品：列表出现新产品', (await page.textContent('body')).includes('E2E Test Product'));
  await page.screenshot({ path: 'docs/assets/admin-products.png', clip: { x: 0, y: 0, width: 1440, height: 860 } });

  // --- 前台可见（ISR 重生成） ---
  await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' });
  check('前台：新产品出现在 /products', (await page.textContent('body')).includes('E2E Test Product'));

  // --- 询盘 API → 后台可见 ---
  const res = await page.request.post(`${BASE}/api/inquiries`, {
    data: {
      name: 'E2E Buyer', email: 'e2e@buyer.com', message: 'E2E inquiry from playwright',
      product: 'e2e-test-product', website: '', elapsedMs: 8000, source: 'e2e',
    },
  });
  const data = await res.json();
  check('询盘：API 提交成功', res.ok() && data.ok && String(data.id).startsWith('INQ-'));
  await page.goto(`${BASE}/admin/inquiries`, { waitUntil: 'networkidle' });
  check('询盘：后台列表可见', (await page.textContent('body')).includes('E2E Buyer'));

  // --- API Key 签发 ---
  await page.click('text=＋ 签发新 Key');
  await page.waitForURL('**/admin/inquiries?key=**', { timeout: 15000 });
  check('API Key：签发并一次性展示', page.url().includes('sk-site-'));

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} 项通过`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
