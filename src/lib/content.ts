import { eq } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { settings, categories, products, banners, cases, news } from '@/db/schema';
import type {
  SiteSettings, NavItem, Category, Product, Banner,
  TrustStat, Advantage, CaseStudy, NewsPost, AboutContent,
} from './types';

/**
 * 内容读取层（P2 起为数据库驱动：Admin 后台修改后前台自动更新）。
 * 函数签名全部 async——P1 的静态 seed.json 退化为「首次启动的种子模板」。
 * 前台所有页面只通过这里取数据。
 */

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  await ensureDb();
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  if (rows.length === 0) return fallback;
  return rows[0].value as T;
}

export async function getSettings(): Promise<SiteSettings> {
  return getSetting<SiteSettings>('site', {
    companyName: 'Your Company Co., Ltd.',
    tagline: 'Reliable Manufacturer & Exporter',
    domain: 'https://example.com',
    description: '',
    seoKeywords: [],
    logoText: 'YOUR LOGO',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    socials: [],
    footerNote: '',
  });
}

export async function getNavigation(): Promise<NavItem[]> {
  return getSetting<NavItem[]>('navigation', [{ label: 'Home', href: '/' }]);
}

export async function getHomeBlocks(): Promise<{ trustStats: TrustStat[]; advantages: Advantage[] }> {
  return getSetting('home', { trustStats: [], advantages: [] });
}

export async function getAbout(): Promise<AboutContent> {
  return getSetting<AboutContent>('about', {
    intro: [], factory: [], culture: '', image: '/placeholders/about-factory.svg',
  });
}

export async function getCategories(): Promise<Category[]> {
  await ensureDb();
  return db.select().from(categories).orderBy(categories.sort);
}

export async function getProducts(includeUnpublished = false): Promise<Product[]> {
  await ensureDb();
  const rows = await db.select().from(products).orderBy(products.sort);
  return includeUnpublished ? rows : rows.filter((p) => p.published);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await ensureDb();
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  await ensureDb();
  const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return rows[0];
}

/** 分类 → 产品 的映射，导航下拉与询盘表单分组共用（产品数据三处联动的数据基础）。 */
export async function getProductsByCategory(): Promise<{ category: Category; products: Product[] }[]> {
  const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
  return cats.map((category) => ({
    category,
    products: prods.filter((p) => p.categorySlug === category.slug),
  }));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const prods = await getProducts();
  const sameCategory = prods.filter(
    (p) => p.slug !== product.slug && p.categorySlug === product.categorySlug,
  );
  const others = prods.filter(
    (p) => p.slug !== product.slug && p.categorySlug !== product.categorySlug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getBanners(): Promise<Banner[]> {
  await ensureDb();
  return db.select().from(banners).orderBy(banners.sort);
}

export async function getCases(): Promise<CaseStudy[]> {
  await ensureDb();
  const rows = await db.select().from(cases);
  return [...rows].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | undefined> {
  await ensureDb();
  const rows = await db.select().from(cases).where(eq(cases.slug, slug)).limit(1);
  return rows[0];
}

export async function getNews(): Promise<NewsPost[]> {
  await ensureDb();
  const rows = await db.select().from(news);
  return [...rows].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | undefined> {
  await ensureDb();
  const rows = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
  return rows[0];
}

/** 去掉末尾斜杠的站点根 URL（sitemap/canonical/JSON-LD 共用）。 */
export async function getSiteUrl(): Promise<string> {
  const s = await getSettings();
  return s.domain.replace(/\/$/, '');
}
