import { NextRequest, NextResponse } from 'next/server';
import { db, discountCodes } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(discountCodes).orderBy(discountCodes.createdAt);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [discount] = await db.insert(discountCodes).values({
      code: body.code.toUpperCase(),
      type: body.type || 'percentage',
      value: body.value,
      minAmount: body.minAmount || null,
      usageLimit: body.usageLimit || null,
      isActive: body.isActive !== false,
    }).returning();
    return NextResponse.json(discount);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await db.update(discountCodes)
      .set({ isActive: body.isActive })
      .where(eq(discountCodes.id, body.id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
