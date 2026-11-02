import { NextResponse } from 'next/server';
import { reseedDb } from '@/db';

/**
 * Demo 站每日重置端点（仅用于线上演示站，本地无需配置）。
 * - 鉴权：Header `x-demo-token` 与环境变量 DEMO_RESET_TOKEN 比对（不配置则本端点禁用）
 * - 行为：清空全部业务表 → 按种子全量重灌（Product A–D 模板内容恢复，询盘/Key 一并清空）
 * - 触发：GitHub Actions demo-reset.yml 每日定时调用（仓库 Secrets 配 DEMO_URL + DEMO_RESET_TOKEN）
 */
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const expected = process.env.DEMO_RESET_TOKEN;
  const got = req.headers.get('x-demo-token') || '';
  if (!expected || got.length !== expected.length || got !== expected) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await reseedDb();

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/', 'layout');

  return NextResponse.json({ ok: true, resetAt: new Date().toISOString() });
}
