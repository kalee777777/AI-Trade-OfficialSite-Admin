import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-black text-brand">404</p>
      <h1 className="mt-4 text-xl font-bold text-ink">Page Not Found</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-primary">Back to Home</Link>
        <Link href="/products" className="btn-outline">Browse Products</Link>
      </div>
    </div>
  );
}
