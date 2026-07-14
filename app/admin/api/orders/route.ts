import { NextRequest, NextResponse } from 'next/server';
import { db, orders } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(orders).orderBy(orders.createdAt);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await db.update(orders)
      .set({
        fulfillmentStatus: body.fulfillmentStatus,
        notes: body.notes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, body.id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
