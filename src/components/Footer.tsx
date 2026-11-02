import Link from 'next/link';
import { getSettings, getNavigation, getProductsByCategory } from '@/lib/content';

/** 通用页脚：公司简介 + 快捷导航 + 产品导航 + 联系方式。Admin 后台可视化修改全部内容。 */
export default async function Footer() {
  const settings = await getSettings();
  const nav = await getNavigation();
  const grouped = await getProductsByCategory();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-brand-dark text-white">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-3 text-base font-extrabold uppercase tracking-wide">{settings.logoText}</p>
          <p className="text-sm leading-relaxed text-white/70">{settings.footerNote}</p>
          <div className="mt-4 flex gap-3">
            {settings.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:border-white hover:text-white"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white/90">Quick Links</p>
          <ul className="space-y-2 text-sm text-white/70">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white/90">Products</p>
          <ul className="space-y-2 text-sm text-white/70">
            {grouped.flatMap(({ products }) =>
              products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="hover:text-white">{p.name}</Link>
                </li>
              )),
            )}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white/90">Contact Us</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>{settings.address}</li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
            </li>
            <li>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white">{settings.phone}</a>
            </li>
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp: {settings.whatsapp}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/60 sm:flex-row">
          <p>© {year} {settings.companyName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/inquiry" className="hover:text-white">Inquiry</Link>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
