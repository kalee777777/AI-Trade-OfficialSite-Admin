import type { MetadataRoute } from 'next';
import { getSiteUrl, getProducts, getCases, getNews } from '@/lib/content';

/** 自动 sitemap：静态页 + 全部产品 / 案例 / 新闻（Admin 增删内容后构建时自动更新）。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/cases`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/news`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/inquiry`, lastModified: now, changeFrequency: 'yearly', priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const productPages: MetadataRoute.Sitemap = getProducts().map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const casePages: MetadataRoute.Sitemap = getCases().map((c) => ({
    url: `${base}/cases/${c.slug}`,
    lastModified: new Date(c.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const newsPages: MetadataRoute.Sitemap = getNews().map((n) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: new Date(n.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...casePages, ...newsPages];
}
