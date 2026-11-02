import { getSettings, getProducts, getCases, getNews, getSiteUrl } from '@/lib/content';

/**
 * llms.txt —— GEO（生成式引擎优化）入口文件。
 * AI 搜索/助手会读取站点根目录的 llms.txt 来理解网站全貌；
 * 内容从数据库自动生成，Admin 改内容后自动同步。
 */
export async function GET() {
  const [settings, products, cases, news] = await Promise.all([
    getSettings(), getProducts(), getCases(), getNews(),
  ]);
  const base = await getSiteUrl();
  const latestNews = news.slice(0, 5);

  const lines: string[] = [
    `# ${settings.companyName}`,
    '',
    `> ${settings.tagline}. ${settings.description}`,
    '',
    `Contact: ${settings.email} | ${settings.phone} | WhatsApp ${settings.whatsapp}`,
    `Address: ${settings.address}`,
    '',

    '## Products',
    '',
    ...products.flatMap((p) => [
      `- [${p.name}](${base}/products/${p.slug}): ${p.tagline} ${p.quotableLine}`,
      '',
    ]),

    '## Case Studies',
    '',
    ...cases.flatMap((c) => [
      `- [${c.title}](${base}/cases/${c.slug}): ${c.summary}`,
      '',
    ]),

    '## Latest News',
    '',
    ...latestNews.flatMap((n) => [
      `- [${n.title}](${base}/news/${n.slug}): ${n.summary}`,
      '',
    ]),

    '## Pages',
    '',
    `- [About Us](${base}/about)`,
    `- [All Products](${base}/products)`,
    `- [Inquiry](${base}/inquiry)`,
    `- [Contact Us](${base}/contact)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
