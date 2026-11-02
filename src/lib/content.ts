import seedJson from '../../data/seed.json';
import type {
  SeedData, SiteSettings, NavItem, Category, Product, Banner,
  TrustStat, Advantage, CaseStudy, NewsPost, AboutContent,
} from './types';

/**
 * 内容读取层（P1：静态 seed.json；P2 起改为优先读数据库、回退 seed，函数签名不变）。
 * 前台所有页面只通过这里取数据 —— 换数据源不改页面代码。
 */
const seed = seedJson as unknown as SeedData;

export function getSettings(): SiteSettings {
  return seed.settings;
}

export function getNavigation(): NavItem[] {
  return seed.navigation;
}

export function getCategories(): Category[] {
  return seed.categories;
}

export function getProducts(includeUnpublished = false): Product[] {
  return includeUnpublished ? seed.products : seed.products.filter((p) => p.published);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts(true).find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return seed.categories.find((c) => c.slug === slug);
}

/** 分类 → 产品 的映射，导航下拉与询盘表单分组共用（产品数据三处联动的数据基础）。 */
export function getProductsByCategory(): { category: Category; products: Product[] }[] {
  return getCategories().map((category) => ({
    category,
    products: getProducts().filter((p) => p.categorySlug === category.slug),
  }));
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = getProducts().filter(
    (p) => p.slug !== product.slug && p.categorySlug === product.categorySlug,
  );
  const others = getProducts().filter(
    (p) => p.slug !== product.slug && p.categorySlug !== product.categorySlug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getBanners(): Banner[] {
  return seed.banners;
}

export function getTrustStats(): TrustStat[] {
  return seed.trustStats;
}

export function getAdvantages(): Advantage[] {
  return seed.advantages;
}

export function getCases(): CaseStudy[] {
  return [...seed.cases].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return seed.cases.find((c) => c.slug === slug);
}

export function getNews(): NewsPost[] {
  return [...seed.news].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return seed.news.find((n) => n.slug === slug);
}

export function getAbout(): AboutContent {
  return seed.about;
}

/** 去掉末尾斜杠的站点根 URL（sitemap/canonical/JSON-LD 共用）。 */
export function getSiteUrl(): string {
  return getSettings().domain.replace(/\/$/, '');
}
