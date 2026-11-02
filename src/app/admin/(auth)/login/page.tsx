import Link from 'next/link';
import { loginAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Admin 登录页（默认密码 admin123，来自 .env 的 ADMIN_PASSWORD 或种子默认值）。 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <p className="text-lg font-extrabold text-ink">管理后台</p>
          <p className="mt-1 text-xs text-muted-foreground">AI Trade Official Site · Admin</p>
        </div>
        <form action={loginAction} className="space-y-4">
          <div>
            <Label htmlFor="password" className="mb-1 block">管理密码</Label>
            <Input id="password" name="password" type="password" required autoFocus placeholder="••••••••" />
          </div>
          {searchParams.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              密码不正确，请重试
            </p>
          )}
          <Button type="submit" className="w-full">登录</Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          默认密码 <code className="rounded bg-muted px-1">admin123</code>，登录后请立即在「设置」中修改。
        </p>
        <p className="mt-2 text-center text-xs">
          <Link href="/" className="text-brand hover:underline">← 返回网站首页</Link>
        </p>
      </div>
    </div>
  );
}
