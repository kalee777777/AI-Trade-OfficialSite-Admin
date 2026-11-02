import Link from 'next/link';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface Crumb {
  label: string;
  href?: string;
}

/** 面包屑（基于 shadcn/ui Breadcrumb，内链走 next/link；页面同时自行输出 BreadcrumbList JSON-LD）。 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
