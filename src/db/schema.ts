import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * 全站数据 schema（Drizzle · SQLite 方言，本地文件与 Turso 云端共用同一套）。
 * 数组/对象字段以 JSON 文本存储（mode:'json' 自动编解码）。
 * DDL 见 db/ddl.ts（首次启动自动建表 + 从 data/seed.json 灌入模板内容）。
 */

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' }).$type<Record<string, unknown>>().notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  sort: integer('sort').notNull().default(0),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  categorySlug: text('category_slug').notNull().default(''),
  tagline: text('tagline').notNull().default(''),
  description: text('description', { mode: 'json' }).$type<string[]>().notNull().default([]),
  image: text('image').notNull().default(''),
  features: text('features', { mode: 'json' }).$type<string[]>().notNull().default([]),
  specs: text('specs', { mode: 'json' }).$type<{ param: string; value: string }[]>().notNull().default([]),
  quotableLine: text('quotable_line').notNull().default(''),
  faq: text('faq', { mode: 'json' }).$type<{ q: string; a: string }[]>().notNull().default([]),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
  sort: integer('sort').notNull().default(0),
});

export const banners = sqliteTable('banners', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  ctaText: text('cta_text').notNull().default(''),
  ctaHref: text('cta_href').notNull().default(''),
  image: text('image').notNull().default(''),
  sort: integer('sort').notNull().default(0),
});

export const cases = sqliteTable('cases', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  content: text('content', { mode: 'json' }).$type<string[]>().notNull().default([]),
  date: text('date').notNull(),
  image: text('image').notNull().default(''),
  products: text('products', { mode: 'json' }).$type<string[]>().notNull().default([]),
  sort: integer('sort').notNull().default(0),
});

export const news = sqliteTable('news', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  content: text('content', { mode: 'json' }).$type<string[]>().notNull().default([]),
  date: text('date').notNull(),
  sort: integer('sort').notNull().default(0),
});

export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(),
  createdAt: text('created_at').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company').notNull().default(''),
  country: text('country').notNull().default(''),
  phone: text('phone').notNull().default(''),
  product: text('product').notNull().default(''),
  message: text('message').notNull(),
  source: text('source').notNull().default('form'),
  pageUrl: text('page_url').notNull().default(''),
  status: text('status').notNull().default('new'),
});

export const apiKeys = sqliteTable('api_keys', {
  key: text('key').primaryKey(),
  label: text('label').notNull().default(''),
  createdAt: text('created_at').notNull(),
  lastUsedAt: text('last_used_at'),
  revoked: integer('revoked', { mode: 'boolean' }).notNull().default(false),
});
