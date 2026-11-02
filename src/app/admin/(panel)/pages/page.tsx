import { getAbout, getHomeBlocks, getNavigation } from '@/lib/content';
import BlocksForm from '@/components/admin/BlocksForm';

/** 页面区块编辑页。 */
export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const [homeBlocks, about, navigation] = await Promise.all([
    getHomeBlocks(), getAbout(), getNavigation(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-ink">页面区块</h1>
      <p className="mb-6 text-xs text-muted-foreground">首页数据条/优势、关于我们页、导航菜单——一个表单统一保存，前台即时更新。</p>
      {searchParams.saved && <p className="mb-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">✓ 已保存，前台已同步更新</p>}
      <BlocksForm
        trustStats={homeBlocks.trustStats}
        advantages={homeBlocks.advantages}
        about={about}
        navigation={navigation}
      />
    </div>
  );
}
