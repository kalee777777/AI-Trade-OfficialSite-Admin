'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { settings, categories, products, banners, cases, news, inquiries, apiKeys } from '@/db/schema';
import { getSession } from '@/lib/session';

/**
 * Admin 全部内容 CRUD 动作（Server Actions）。
 * 模式：表单提交 → 鉴权 → 落库 → revalidatePath 全站刷新 → redirect 回列表页。
 * 复杂嵌套结构（产品规格/FAQ 等）由客户端表单序列化为 payload JSON 字段传入。
 */

async function requireAdmin(): Promise<void> {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');
}

function refresh(): void {
  revalidatePath('/', 'layout');
}

function payload<T>(formData: FormData, key = 'payload'): T {
  return JSON.parse(String(formData.get(key) || '{}')) as T;
}

function str(formData: FormData, key: string, fallback = ''): string {
  const v = formData.get(key);
  return v == null ? fallback : String(v).trim();
}

function lines(value: string): string[] {
  return value.split(/\n+/).map((s) => s.trim()).filter(Boolean);
}

async function setSetting(key: string, value: unknown): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value: value as Record<string, unknown> })
    .onConflictDoUpdate({ target: settings.key, set: { value: value as Record<string, unknown> } });
}

/* ============ 产品 ============ */

export interface ProductPayload {
  id?: string;
  slug: string;
  name: string;
  categorySlug: string;
  tagline: string;
  description: string[];
  image: string;
  features: string[];
  specs: { param: string; value: string }[];
  quotableLine: string;
  faq: { q: string; a: string }[];
  published: boolean;
  sort: number;
}

export async function saveProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const p = payload<ProductPayload>(formData);
  if (!p.name || !p.slug) redirect('/admin/products/new?error=required');

  const row = {
    id: p.id || `prd-${Date.now()}`,
    slug: p.slug,
    name: p.name,
    categorySlug: p.categorySlug,
    tagline: p.tagline ?? '',
    description: p.description ?? [],
    image: p.image ?? '',
    features: p.features ?? [],
    specs: p.specs ?? [],
    quotableLine: p.quotableLine ?? '',
    faq: p.faq ?? [],
    published: p.published !== false,
    sort: Number(p.sort) || 0,
  };
  try {
    await db.insert(products).values(row).onConflictDoUpdate({ target: products.id, set: row });
  } catch {
    redirect('/admin/products?error=slug');
  }
  refresh();
  redirect('/admin/products?saved=1');
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, String(formData.get('id'))));
  refresh();
  redirect('/admin/products?deleted=1');
}

export async function toggleProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const id = String(formData.get('id'));
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (rows[0]) {
    await db.update(products).set({ published: !rows[0].published }).where(eq(products.id, id));
  }
  refresh();
  redirect('/admin/products');
}

/* ============ 分类 ============ */

export async function saveCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const row = {
    id: str(formData, 'id') || `cat-${Date.now()}`,
    slug: str(formData, 'slug'),
    name: str(formData, 'name'),
    description: str(formData, 'description'),
    sort: Number(str(formData, 'sort', '0')) || 0,
  };
  if (!row.name || !row.slug) redirect('/admin/categories?error=required');
  try {
    await db.insert(categories).values(row).onConflictDoUpdate({ target: categories.id, set: row });
  } catch {
    redirect('/admin/categories?error=slug');
  }
  refresh();
  redirect('/admin/categories?saved=1');
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, String(formData.get('id'))));
  refresh();
  redirect('/admin/categories?deleted=1');
}

/* ============ Banner ============ */

export async function saveBannerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const row = {
    id: str(formData, 'id') || `bn-${Date.now()}`,
    title: str(formData, 'title'),
    subtitle: str(formData, 'subtitle'),
    ctaText: str(formData, 'ctaText'),
    ctaHref: str(formData, 'ctaHref'),
    image: str(formData, 'image'),
    sort: Number(str(formData, 'sort', '0')) || 0,
  };
  if (!row.title) redirect('/admin/banners?error=required');
  await db.insert(banners).values(row).onConflictDoUpdate({ target: banners.id, set: row });
  refresh();
  redirect('/admin/banners?saved=1');
}

export async function deleteBannerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(banners).where(eq(banners.id, String(formData.get('id'))));
  refresh();
  redirect('/admin/banners?deleted=1');
}

/* ============ 新闻 ============ */

export async function saveNewsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const slug = str(formData, 'slug');
  const row = {
    slug,
    title: str(formData, 'title'),
    summary: str(formData, 'summary'),
    content: lines(str(formData, 'content')),
    date: str(formData, 'date') || new Date().toISOString().slice(0, 10),
    sort: Number(str(formData, 'sort', '0')) || 0,
  };
  if (!row.title || !slug) redirect(`/admin/news/${str(formData, 'orig') || 'new'}?error=required`);
  try {
    await db.insert(news).values(row).onConflictDoUpdate({ target: news.slug, set: row });
  } catch {
    redirect('/admin/news?error=slug');
  }
  refresh();
  redirect('/admin/news?saved=1');
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(news).where(eq(news.slug, String(formData.get('slug'))));
  refresh();
  redirect('/admin/news?deleted=1');
}

/* ============ 案例 ============ */

export async function saveCaseAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const slug = str(formData, 'slug');
  const row = {
    slug,
    title: str(formData, 'title'),
    summary: str(formData, 'summary'),
    content: lines(str(formData, 'content')),
    date: str(formData, 'date') || new Date().toISOString().slice(0, 10),
    image: str(formData, 'image'),
    products: str(formData, 'products').split(',').map((s) => s.trim()).filter(Boolean),
    sort: Number(str(formData, 'sort', '0')) || 0,
  };
  if (!row.title || !slug) redirect(`/admin/cases/${str(formData, 'orig') || 'new'}?error=required`);
  try {
    await db.insert(cases).values(row).onConflictDoUpdate({ target: cases.slug, set: row });
  } catch {
    redirect('/admin/cases?error=slug');
  }
  refresh();
  redirect('/admin/cases?saved=1');
}

export async function deleteCaseAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(cases).where(eq(cases.slug, String(formData.get('slug'))));
  refresh();
  redirect('/admin/cases?deleted=1');
}

/* ============ 询盘 ============ */

export async function updateInquiryStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  await db
    .update(inquiries)
    .set({ status: String(formData.get('status')) })
    .where(eq(inquiries.id, String(formData.get('id'))));
  redirect(String(formData.get('back') || '/admin/inquiries'));
}

export async function deleteInquiryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db.delete(inquiries).where(eq(inquiries.id, String(formData.get('id'))));
  redirect(String(formData.get('back') || '/admin/inquiries'));
}

/* ============ API Keys（供 AI-Trade-Workbench 同步，P3 使用） ============ */

function randomKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return `sk-site-${Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
}

export async function createApiKeyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const key = randomKey();
  await db.insert(apiKeys).values({
    key,
    label: str(formData, 'label') || 'workbench',
    createdAt: new Date().toISOString(),
  });
  redirect(`/admin/inquiries?key=${key}`);
}

export async function revokeApiKeyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  await db
    .update(apiKeys)
    .set({ revoked: true })
    .where(eq(apiKeys.key, String(formData.get('key'))));
  redirect('/admin/inquiries');
}

export async function listApiKeysForAdmin(): Promise<
  { key: string; label: string; createdAt: string; revoked: boolean }[]
> {
  const session = await getSession();
  if (!session.isAdmin) return [];
  await ensureDb();
  const rows = await db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
  return rows.map((r) => ({ key: r.key, label: r.label, createdAt: r.createdAt, revoked: r.revoked }));
}

/* ============ 页面区块（首页数据/优势 + 关于我们 + 导航） ============ */

export interface BlocksPayload {
  home: { trustStats: { value: string; label: string }[]; advantages: { title: string; description: string }[] };
  about: { intro: string[]; factory: { title: string; text: string }[]; culture: string; image: string };
  navigation: { label: string; href: string; dropdown?: boolean }[];
}

export async function saveBlocksAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const data = payload<BlocksPayload>(formData);
  await setSetting('home', data.home ?? { trustStats: [], advantages: [] });
  await setSetting('about', data.about ?? {});
  await setSetting('navigation', data.navigation ?? []);
  refresh();
  redirect('/admin/pages?saved=1');
}

/* ============ 站点设置 ============ */

export async function saveSettingsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureDb();
  const data = payload<Record<string, unknown>>(formData);
  await setSetting('site', data);
  refresh();
  redirect('/admin/settings?saved=1');
}
