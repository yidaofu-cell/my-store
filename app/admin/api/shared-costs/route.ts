import { NextRequest, NextResponse } from 'next/server';
import { getDb, sharedCosts } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.select().from(sharedCosts).orderBy(sharedCosts.month);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const existing = await db.select().from(sharedCosts).where(eq(sharedCosts.month, body.month)).limit(1);

    if (existing.length > 0) {
      await db.update(sharedCosts).set({
        totalShipping: body.totalShipping || 0,
        totalStorage: body.totalStorage || 0,
        updatedAt: new Date(),
      }).where(eq(sharedCosts.month, body.month));
    } else {
      await db.insert(sharedCosts).values({
        month: body.month,
        totalShipping: body.totalShipping || 0,
        totalStorage: body.totalStorage || 0,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
