'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: '仪表盘', exact: true },
  { href: '/admin/products', label: '产品管理' },
  { href: '/admin/categories', label: '产品分类' },
  { href: '/admin/banners', label: '首页 Banner' },
  { href: '/admin/news', label: '新闻动态' },
  { href: '/admin/cases', label: '客户案例' },
  { href: '/admin/inquiries', label: '询盘管理' },
  { href: '/admin/pages', label: '页面区块' },
  { href: '/admin/settings', label: '站点设置' },
];

export default function SidebarLinks() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1" aria-label="Admin navigation">
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              'block rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
              (active ? 'bg-brand text-white' : 'text-ink hover:bg-accent hover:text-accent-foreground')
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
