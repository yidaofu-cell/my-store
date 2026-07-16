import { NextRequest, NextResponse } from 'next/server';
import { getDb, ozonReports } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.select().from(ozonReports).orderBy(ozonReports.month);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const year = parseInt(body.month?.split('-')[0]);
    const monthNum = parseInt(body.month?.split('-')[1]);

    const totalPlatformFees =
      (body.ozonCommission || 0) +
      (body.logisticsFee || 0) +
      (body.returnLoss || 0) +
      (body.finesPenalties || 0) +
      (body.otherPlatformFees || 0);

    const totalAdditionalCost =
      (body.purchaseCost || 0) +
      (body.shippingCost || 0) +
      (body.laborCost || 0) +
      (body.marketingCost || 0) +
      (body.otherCost || 0);

    const grossProfit = (body.netPayout || 0) - (body.purchaseCost || 0) - (body.shippingCost || 0);
    const netProfit = (body.netPayout || 0) - totalAdditionalCost;
    const profitMargin = (body.totalRevenue || 0) > 0 ? (netProfit / body.totalRevenue) * 100 : 0;

    const [report] = await db.insert(ozonReports).values({
      month: body.month,
      year,
      monthNum,
      totalRevenue: body.totalRevenue || 0,
      ozonCommission: body.ozonCommission || 0,
      logisticsFee: body.logisticsFee || 0,
      returnLoss: body.returnLoss || 0,
      finesPenalties: body.finesPenalties || 0,
      otherPlatformFees: body.otherPlatformFees || 0,
      netPayout: body.netPayout || 0,
      purchaseCost: body.purchaseCost || 0,
      shippingCost: body.shippingCost || 0,
      laborCost: body.laborCost || 0,
      marketingCost: body.marketingCost || 0,
      otherCost: body.otherCost || 0,
      totalPlatformFees,
      totalAdditionalCost,
      grossProfit,
      netProfit,
      profitMargin,
      screenshotUrl: body.screenshotUrl || '',
      notes: body.notes || '',
    }).returning();

    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const totalPlatformFees =
      (body.ozonCommission || 0) +
      (body.logisticsFee || 0) +
      (body.returnLoss || 0) +
      (body.finesPenalties || 0) +
      (body.otherPlatformFees || 0);

    const totalAdditionalCost =
      (body.purchaseCost || 0) +
      (body.shippingCost || 0) +
      (body.laborCost || 0) +
      (body.marketingCost || 0) +
      (body.otherCost || 0);

    const grossProfit = (body.netPayout || 0) - (body.purchaseCost || 0) - (body.shippingCost || 0);
    const netProfit = (body.netPayout || 0) - totalAdditionalCost;
    const profitMargin = (body.totalRevenue || 0) > 0 ? (netProfit / body.totalRevenue) * 100 : 0;

    await db.update(ozonReports).set({
      totalRevenue: body.totalRevenue || 0,
      ozonCommission: body.ozonCommission || 0,
      logisticsFee: body.logisticsFee || 0,
      returnLoss: body.returnLoss || 0,
      finesPenalties: body.finesPenalties || 0,
      otherPlatformFees: body.otherPlatformFees || 0,
      netPayout: body.netPayout || 0,
      purchaseCost: body.purchaseCost || 0,
      shippingCost: body.shippingCost || 0,
      laborCost: body.laborCost || 0,
      marketingCost: body.marketingCost || 0,
      otherCost: body.otherCost || 0,
      totalPlatformFees,
      totalAdditionalCost,
      grossProfit,
      netProfit,
      profitMargin,
      screenshotUrl: body.screenshotUrl || '',
      notes: body.notes || '',
      updatedAt: new Date(),
    }).where(eq(ozonReports.id, body.id));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = getDb();
    await db.delete(ozonReports).where(eq(ozonReports.id, id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
