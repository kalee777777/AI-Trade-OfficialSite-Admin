import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/content';

/**
 * robots.txt —— GEO 关键配置：
 * 1. 对所有爬虫开放全站（/admin、/api、/showcase 除外）
 * 2. 显式放行主流 AI 爬虫（GPTBot / ClaudeBot / PerplexityBot 等），
 *    让 ChatGPT / Claude / Perplexity 等 AI 搜索能抓取并推荐本站内容。
 */
const AI_CRAWLERS = [
  'GPTBot',            // OpenAI
  'OAI-SearchBot',     // OpenAI search
  'ChatGPT-User',      // ChatGPT user-initiated fetch
  'ClaudeBot',         // Anthropic
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',     // Perplexity
  'Perplexity-User',
  'Google-Extended',   // Gemini training
  'Applebot-Extended', // Apple Intelligence
  'CCBot',             // Common Crawl
  'Bytespider',        // ByteDance
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getSiteUrl();
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/showcase'] },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
