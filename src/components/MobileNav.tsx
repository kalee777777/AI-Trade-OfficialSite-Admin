'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getNavigation } from '@/lib/content';

/** 移动端折叠菜单：汉堡按钮 + 产品分类手风琴。 */
export default function MobileNav({ grouped }: {
  grouped: { name: string; products: { name: string; href: string }[] }[];
}) {
  const [open, setOpen] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const nav = getNavigation().filter((n) => !n.dropdown);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle menu"
        className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          {open ? (
            <path fillRule="evenodd" d="M4.29 4.29a1 1 0 011.42 0L10 8.59l4.29-4.3a1 1 0 111.42 1.42L11.41 10l4.3 4.29a1 1 0 01-1.42 1.42L10 11.41l-4.29 4.3a1 1 0 01-1.42-1.42L8.59 10l-4.3-4.29a1 1 0 010-1.42z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M3 5.75A.75.75 0 013.75 5h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.75zm0 4.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10zm0 4.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          )}
        </svg>
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-16 z-50 max-h-[80vh] overflow-y-auto border-b border-line bg-paper p-4 shadow-lg" aria-label="Mobile navigation">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-semibold text-ink hover:bg-brand-tint"
            onClick={() => setOpenProducts(!openProducts)}
          >
            Products
            <span aria-hidden="true">{openProducts ? '−' : '+'}</span>
          </button>
          {openProducts && (
            <div className="ml-3 border-l border-line pl-3">
              {grouped.map((g) => (
                <div key={g.name} className="py-1">
                  <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-muted">{g.name}</p>
                  {g.products.map((p) => (
                    <Link key={p.href} href={p.href} className="block rounded px-2 py-1.5 text-sm text-ink hover:bg-brand-tint hover:text-brand">
                      {p.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-3 py-2 text-sm font-semibold text-ink hover:bg-brand-tint"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/inquiry" className="btn-primary mt-3 w-full">Get a Quote</Link>
        </nav>
      )}
    </div>
  );
}
