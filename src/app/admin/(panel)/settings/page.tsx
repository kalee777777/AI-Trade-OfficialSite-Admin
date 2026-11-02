import { getSettings } from '@/lib/content';
import { changePasswordAction } from '@/lib/actions/auth';
import SettingsForm from '@/components/admin/SettingsForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PW_MESSAGES: Record<string, { text: string; tone: 'ok' | 'error' }> = {
  ok: { text: '✓ 密码已修改，下次登录请使用新密码', tone: 'ok' },
  wrong: { text: '旧密码不正确', tone: 'error' },
  invalid: { text: '新密码至少 6 位，且两次输入需一致', tone: 'error' },
};

/** 站点设置 + 账号安全。 */
export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string; pw?: string };
}) {
  const settings = await getSettings();
  const pwMsg = searchParams.pw ? PW_MESSAGES[searchParams.pw] : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-ink">站点设置</h1>
      {searchParams.saved && <p className="mb-4 rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground">✓ 已保存，前台已同步更新</p>}

      <SettingsForm settings={settings} />

      <div className="card mt-8 space-y-4 p-6">
        <p className="text-sm font-bold text-ink">修改管理密码</p>
        {pwMsg && (
          <p className={'rounded-md px-4 py-2 text-sm ' + (pwMsg.tone === 'ok' ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive')}>
            {pwMsg.text}
          </p>
        )}
        <form action={changePasswordAction} className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label className="mb-1 block">旧密码</Label>
            <Input name="old_password" type="password" required />
          </div>
          <div>
            <Label className="mb-1 block">新密码（≥6 位）</Label>
            <Input name="new_password" type="password" required minLength={6} />
          </div>
          <div>
            <Label className="mb-1 block">确认新密码</Label>
            <Input name="confirm_password" type="password" required minLength={6} />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" variant="outline">修改密码</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
