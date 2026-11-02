'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, ensureDb } from '@/db';
import { settings } from '@/db/schema';
import { getSession } from '@/lib/session';

/** Admin 鉴权动作：登录 / 登出 / 修改密码。 */

async function getPasswordHash(): Promise<string> {
  await ensureDb();
  const rows = await db.select().from(settings).where(eq(settings.key, 'admin_password')).limit(1);
  const stored = rows[0]?.value as { hash?: string } | undefined;
  if (stored?.hash) return stored.hash;
  return bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
}

export async function isDefaultPassword(): Promise<boolean> {
  return bcrypt.compare('admin123', await getPasswordHash());
}

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get('password') || '');
  const hash = await getPasswordHash();
  if (!password || !bcrypt.compareSync(password, hash)) {
    redirect('/admin/login?error=1');
  }
  const session = await getSession();
  session.isAdmin = true;
  await session.save();
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect('/admin/login');
}

export async function changePasswordAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  const oldPassword = String(formData.get('old_password') || '');
  const newPassword = String(formData.get('new_password') || '');
  const confirm = String(formData.get('confirm_password') || '');

  const hash = await getPasswordHash();
  if (!bcrypt.compareSync(oldPassword, hash)) {
    redirect('/admin/settings?pw=wrong');
  }
  if (newPassword.length < 6 || newPassword !== confirm) {
    redirect('/admin/settings?pw=invalid');
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  await db
    .insert(settings)
    .values({ key: 'admin_password', value: { hash: newHash } })
    .onConflictDoUpdate({ target: settings.key, set: { value: { hash: newHash } } });
  redirect('/admin/settings?pw=ok');
}
