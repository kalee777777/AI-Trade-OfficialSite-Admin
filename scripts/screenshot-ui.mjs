/**
 * 截图脚本：为 docs/prompts 生成效果图预览（首页 5 套主题预设 + 产品页 + 组件演示页）。
 * 用法：dev/prod 服务器跑在 :3000 时执行  node scripts/screenshot-ui.mjs
 * 依赖 playwright（未安装时先执行：npm i -D playwright && npx playwright install chromium）。
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error(
    '缺少 playwright 依赖。安装方式：npm i -D playwright && npx playwright install chromium\n' +
      '（已有 playwright 的项目可设环境变量 PLAYWRIGHT_MODULES 指向其 node_modules 目录）',
  );
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), 'docs', 'assets');
const BASE = 'http://localhost:3000';

const PRESETS = {
  blue:   { '--brand': '224 76% 48%', '--brand-dark': '224 76% 33%', '--brand-light': '217 91% 60%', '--brand-tint': '220 88% 97%' },
  orange: { '--brand': '14 84% 50%',  '--brand-dark': '11 80% 36%',  '--brand-light': '18 87% 57%',  '--brand-tint': '22 92% 95%' },
  green:  { '--brand': '160 84% 30%', '--brand-dark': '161 88% 22%', '--brand-light': '153 69% 45%', '--brand-tint': '152 55% 95%' },
  gold:   { '--brand': '41 90% 46%',  '--brand-dark': '36 80% 32%',  '--brand-light': '45 93% 58%',  '--brand-tint': '42 80% 95%' },
  violet: { '--brand': '262 83% 58%', '--brand-dark': '263 85% 42%', '--brand-light': '258 90% 66%', '--brand-tint': '260 80% 96%' },
};

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 860 } });

  // 1) 首页 5 套主题预设（Hero 区裁剪）
  for (const [name, vars] of Object.entries(PRESETS)) {
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.evaluate((v) => {
      const root = document.documentElement;
      Object.entries(v).forEach(([k, val]) => root.style.setProperty(k, val));
    }, vars);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT_DIR, `ui-preset-${name}.png`), clip: { x: 0, y: 0, width: 1440, height: 780 } });
    console.log(`✓ ui-preset-${name}.png`);
  }

  // 2) 产品详情页 + 组件演示页
  await page.goto(`${BASE}/products/product-a`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(OUT_DIR, 'page-product-detail.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('✓ page-product-detail.png');

  await page.goto(`${BASE}/showcase`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(OUT_DIR, 'page-showcase.png'), fullPage: true });
  console.log('✓ page-showcase.png');

  await browser.close();
  console.log('done →', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
