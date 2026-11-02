import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface AdminSession {
  isAdmin?: boolean;
}

export async function getSession(): Promise<IronSession<AdminSession>> {
  return getIronSession<AdminSession>(cookies(), {
    cookieName: 'ai_trade_admin',
    password:
      process.env.SESSION_SECRET ||
      'ai-trade-officialsite-template-dev-secret-change-me', // ≥32 字符；生产请在 .env 配 SESSION_SECRET
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 天
    },
  });
}
