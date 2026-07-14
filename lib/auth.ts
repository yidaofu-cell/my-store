import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  adminId: number;
  username: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'a-very-long-secret-key-at-least-32-chars-change-me',
  cookieName: 'store_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function login(username: string, password: string): Promise<boolean> {
  // If DATABASE_URL is set, use the real database
  if (process.env.DATABASE_URL) {
    try {
      const { getDb, admins } = await import('./db');
      const { eq } = await import('drizzle-orm');
      const { compare } = await import('bcryptjs');

      const db = getDb();
      const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
      if (result.length === 0) return false;

      const admin = result[0];
      const isValid = await compare(password, admin.passwordHash);
      if (!isValid) return false;

      const session = await getSession();
      session.adminId = admin.id;
      session.username = admin.username;
      session.isLoggedIn = true;
      await session.save();
      return true;
    } catch (err) {
      console.error('[AUTH] DB login error:', err);
      return false;
    }
  }

  // Fallback for dev without database
  if (username === 'admin' && password === 'admin123') {
    const session = await getSession();
    session.adminId = 1;
    session.username = 'admin';
    session.isLoggedIn = true;
    await session.save();
    return true;
  }

  return false;
}

export async function logout(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true;
}
