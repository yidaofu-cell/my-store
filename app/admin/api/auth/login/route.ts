import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const success = await login(username, password);

  if (success) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
