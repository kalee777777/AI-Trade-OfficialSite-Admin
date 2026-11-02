'use client';

import type { FaqItem } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * 产品 FAQ 手风琴（Radix Accordion，无障碍 + 展开动画）。
 * 内容始终渲染在 HTML 中（折叠仅视觉隐藏），SEO/JSON-LD 不受影响。
 */
export default function FaqAccordion({ items, productName }: { items: FaqItem[]; productName: string }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((f, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-sm font-semibold text-ink hover:no-underline hover:text-brand">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
      <p className="sr-only">Frequently asked questions about {productName}</p>
    </Accordion>
  );
}
