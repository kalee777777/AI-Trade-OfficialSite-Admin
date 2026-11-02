'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/** 移动端折叠菜单：Sheet 侧边抽屉 + 产品分类手风琴（shadcn/ui）。导航数据由服务端 Header 传入。 */
export default function MobileNav({
  nav,
  grouped,
}: {
  nav: NavItem[];
  grouped: { name: string; products: { name: string; href: string }[] }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mt-4 flex flex-col">
            <Accordion type="single" collapsible>
              <AccordionItem value="products">
                <AccordionTrigger className="py-3 text-sm font-semibold text-ink hover:no-underline">
                  Products
                </AccordionTrigger>
                <AccordionContent>
                  {grouped.map((g) => (
                    <div key={g.name} className="mb-2">
                      <p className="px-1 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {g.name}
                      </p>
                      {g.products.map((p) => (
                        <Link
                          key={p.href}
                          href={p.href}
                          onClick={() => setOpen(false)}
                          className="block rounded px-3 py-2 text-sm text-ink hover:bg-accent hover:text-accent-foreground"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="block rounded bg-accent px-3 py-2 text-center text-sm font-semibold text-accent-foreground"
                  >
                    View All Products →
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b py-3 text-sm font-semibold text-ink hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-5 w-full">
              <Link href="/inquiry" onClick={() => setOpen(false)}>Get a Quote</Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
