/**
 * P3 询盘互通 E2E：签发 Key → 提交询盘 → 拉取（全量/增量/分页）→ 吊销 → 403/401。
 * 用法（服务器跑在 :3000，默认密码 admin123）：
 *   node scripts/e2e-sync.mjs
 * playwright 解析同 e2e-admin.mjs（本仓库依赖 或 PLAYWRIGHT_FROM 环境变量）。
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
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // 登录 → 签发新 Key → 从 URL 捕获明文
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
  await page.fill('#password', 'admin123');
  await page.click('button[type=submit]');
  await page.waitForURL('**/admin', { timeout: 15000 });

  const marker = `sync-${Date.now()}@e2e.test`;
  await page.goto(`${BASE}/admin/inquiries`, { waitUntil: 'networkidle' });
  await page.fill('input[name=label]', 'e2e-sync');
  await page.click('text=＋ 签发新 Key');
  await page.waitForURL('**/admin/inquiries?key=**', { timeout: 15000 });
  const key = new URL(page.url()).searchParams.get('key');
  check('签发 Key 并捕获明文', Boolean(key && key.startsWith('sk-site-')));

  // 提交一条带标记的询盘
  const submit = await page.request.post(`${BASE}/api/inquiries`, {
    data: {
      name: 'Sync E2E Buyer', email: marker, message: 'P3 sync e2e inquiry',
      product: 'product-a', website: '', elapsedMs: 8000, source: 'e2e-sync',
    },
  });
  check('提交询盘成功', submit.ok() && (await submit.json()).ok);

  // ① 全量拉取包含新询盘
  const all = await page.request.get(`${BASE}/api/sync/inquiries`, { headers: { 'X-Api-Key': key } });
  const allData = await all.json();
  check('全量拉取 200 且含标记询盘', all.status() === 200 && allData.inquiries.some((i) => i.email === marker));

  // ② since 增量：取最后一条 createdAt 之后应拉不到它
  const lastCreatedAt = allData.inquiries[allData.inquiries.length - 1].createdAt;
  const sinceRes = await page.request.get(`${BASE}/api/sync/inquiries?since=${encodeURIComponent(lastCreatedAt)}`, {
    headers: { 'X-Api-Key': key },
  });
  const sinceData = await sinceRes.json();
  check('since 增量过滤生效', sinceRes.status() === 200 && !sinceData.inquiries.some((i) => i.email === marker));

  // ③ 分页：limit=1 → hasMore + nextCursor，cursor 翻页可继续
  const p1 = await (await page.request.get(`${BASE}/api/sync/inquiries?limit=1`, { headers: { 'X-Api-Key': key } })).json();
  check('分页 limit=1 返回 hasMore/nextCursor', p1.inquiries.length === 1 && p1.hasMore === true && Boolean(p1.nextCursor));
  const p2 = await page.request.get(`${BASE}/api/sync/inquiries?cursor=${encodeURIComponent(p1.nextCursor)}&limit=1`, {
    headers: { 'X-Api-Key': key },
  }).then((r) => r.json());
  check('cursor 翻页不重复首条', p2.inquiries.length > 0 && p2.inquiries[0].id !== p1.inquiries[0].id);

  // ④ 无 Key → 401
  const noKey = await page.request.get(`${BASE}/api/sync/inquiries`);
  check('无 Key 返回 401', noKey.status() === 401);

  // ⑤ 吊销该 Key（按 last4 定位行内表单）→ 403
  const last4 = key.slice(-4);
  await page.goto(`${BASE}/admin/inquiries`, { waitUntil: 'networkidle' });
  const revokeBtn = page.locator(`form:has(input[value="${key}"]) button:has-text("吊销")`);
  await revokeBtn.click();
  await page.waitForURL('**/admin/inquiries', { timeout: 15000 });
  await page.waitForTimeout(500);
  const revoked = await page.request.get(`${BASE}/api/sync/inquiries`, { headers: { 'X-Api-Key': key } });
  check('吊销后返回 403', revoked.status() === 403);

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} 项通过`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
