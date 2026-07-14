import { NextRequest, NextResponse } from 'next/server';
import { db, shippingRates } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(shippingRates).orderBy(shippingRates.price);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [rate] = await db.insert(shippingRates).values({
      name: body.name,
      price: body.price,
      minDays: body.minDays || 7,
      maxDays: body.maxDays || 12,
      minOrderForFree: body.minOrderForFree || null,
      isActive: true,
    }).returning();
    return NextResponse.json(rate);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await db.update(shippingRates)
      .set({ isActive: body.isActive, price: body.price, name: body.name })
      .where(eq(shippingRates.id, body.id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
