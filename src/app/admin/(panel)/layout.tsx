import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import { getSession } from '@/lib/session';
import { logoutAction } from '@/lib/actions/auth';
import SidebarLinks from '@/components/admin/SidebarLinks';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/** Admin 面板外壳：会话守卫 + 侧栏导航。 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">管理后台</p>
            <p className="text-[10px] text-muted-foreground">AI Trade Official Site</p>
          </div>
        </div>
        <SidebarLinks />
        <div className="mt-auto pt-4">
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm" className="w-full">退出登录</Button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 移动端顶部导航 */}
        <div className="border-b border-line bg-paper p-3 md:hidden">
          <details>
            <summary className="cursor-pointer text-sm font-bold text-ink">☰ 管理后台菜单</summary>
            <div className="mt-3"><SidebarLinks /></div>
          </details>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
