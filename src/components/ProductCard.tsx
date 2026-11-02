import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

/** 产品卡片：列表页 / 首页产品区 / 相关产品共用（shadcn/ui Card）。 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg">
        <div className="aspect-[4/3] overflow-hidden bg-accent">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={`${product.name} — ${product.tagline}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-base font-bold text-ink group-hover:text-brand">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand">
            View Details →
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
