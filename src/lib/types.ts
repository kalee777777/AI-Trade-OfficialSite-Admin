/** 全站内容的类型定义。数据来源：data/seed.json（P1 静态种子；P2 起 Admin 后台写入数据库，schema 不变）。 */

export interface SiteSettings {
  companyName: string;
  tagline: string;
  domain: string;
  description: string;
  seoKeywords: string[];
  logoText: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  socials: { platform: string; url: string }[];
  footerNote: string;
}

export interface NavItem {
  label: string;
  href: string;
  dropdown?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface ProductSpec {
  param: string;
  value: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  tagline: string;
  description: string[];
  image: string;
  features: string[];
  specs: ProductSpec[];
  quotableLine: string;
  faq: FaqItem[];
  published: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
}

export interface TrustStat {
  value: string;
  label: string;
}

export interface Advantage {
  title: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  content: string[];
  date: string;
  image: string;
  products: string[];
}

export interface NewsPost {
  slug: string;
  title: string;
  summary: string;
  content: string[];
  date: string;
}

export interface AboutContent {
  intro: string[];
  factory: { title: string; text: string }[];
  culture: string;
  image: string;
}

export interface SeedData {
  settings: SiteSettings;
  navigation: NavItem[];
  categories: Category[];
  products: Product[];
  banners: Banner[];
  trustStats: TrustStat[];
  advantages: Advantage[];
  cases: CaseStudy[];
  news: NewsPost[];
  about: AboutContent;
}
