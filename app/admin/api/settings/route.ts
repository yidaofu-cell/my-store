import { NextRequest, NextResponse } from 'next/server';
import { db, storeSettings } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(storeSettings);
    const settings: Record<string, string> = {};
    for (const row of result) {
      settings[row.key] = row.value;
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      const existing = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(storeSettings).set({ value: value as string }).where(eq(storeSettings.key, key));
      } else {
        await db.insert(storeSettings).values({ key, value: value as string });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
