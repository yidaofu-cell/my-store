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

function calc(body: any) {
  const ozonNetRub = (body.salesRevenue || 0)
    - (body.returns || 0)
    - (body.ozonCommission || 0)
    - (body.deliveryService || 0)
    - (body.partnerServices || 0)
    - (body.fboService || 0)
    - (body.promotionAdvertising || 0)
    - (body.otherFines || 0)
    + (body.compensation || 0)
    + (body.otherAccruals || 0);

  const rate = body.exchangeRate || 0.08;
  const ozonNetRmb = ozonNetRub * rate;
  const totalAdditionalCost = (body.purchaseCost || 0) + (body.shippingCost || 0) + (body.laborCost || 0) + (body.marketingCost || 0) + (body.otherCost || 0);
  const netProfit = ozonNetRmb - totalAdditionalCost;
  const totalRevenueRmb = (body.salesRevenue || 0) * rate;
  const profitMargin = totalRevenueRmb > 0 ? (netProfit / totalRevenueRmb) * 100 : 0;

  return { ozonNetRub, ozonNetRmb, totalAdditionalCost, netProfit, profitMargin };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();
    const year = parseInt(body.month?.split('-')[0]);
    const monthNum = parseInt(body.month?.split('-')[1]);
    const c = calc(body);

    const [report] = await db.insert(ozonReports).values({
      month: body.month, year, monthNum,
      salesRevenue: body.salesRevenue || 0,
      returns: body.returns || 0,
      ozonCommission: body.ozonCommission || 0,
      deliveryService: body.deliveryService || 0,
      partnerServices: body.partnerServices || 0,
      fboService: body.fboService || 0,
      promotionAdvertising: body.promotionAdvertising || 0,
      otherFines: body.otherFines || 0,
      compensation: body.compensation || 0,
      otherAccruals: body.otherAccruals || 0,
      exchangeRate: body.exchangeRate || 0.08,
      purchaseCost: body.purchaseCost || 0,
      shippingCost: body.shippingCost || 0,
      laborCost: body.laborCost || 0,
      marketingCost: body.marketingCost || 0,
      otherCost: body.otherCost || 0,
      ozonNetRub: c.ozonNetRub,
      ozonNetRmb: c.ozonNetRmb,
      totalAdditionalCost: c.totalAdditionalCost,
      netProfit: c.netProfit,
      profitMargin: c.profitMargin,
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
    const c = calc(body);

    const setData: any = {
      salesRevenue: body.salesRevenue || 0,
      returns: body.returns || 0,
      ozonCommission: body.ozonCommission || 0,
      deliveryService: body.deliveryService || 0,
      partnerServices: body.partnerServices || 0,
      fboService: body.fboService || 0,
      promotionAdvertising: body.promotionAdvertising || 0,
      otherFines: body.otherFines || 0,
      compensation: body.compensation || 0,
      otherAccruals: body.otherAccruals || 0,
      exchangeRate: body.exchangeRate || 0.08,
      purchaseCost: body.purchaseCost || 0,
      shippingCost: body.shippingCost || 0,
      laborCost: body.laborCost || 0,
      marketingCost: body.marketingCost || 0,
      otherCost: body.otherCost || 0,
      ozonNetRub: c.ozonNetRub,
      ozonNetRmb: c.ozonNetRmb,
      totalAdditionalCost: c.totalAdditionalCost,
      netProfit: c.netProfit,
      profitMargin: c.profitMargin,
      screenshotUrl: body.screenshotUrl || '',
      notes: body.notes || '',
      updatedAt: new Date(),
    };

    if (body.month) {
      setData.month = body.month;
      setData.year = parseInt(body.month.split('-')[0]);
      setData.monthNum = parseInt(body.month.split('-')[1]);
    }

    await db.update(ozonReports).set(setData).where(eq(ozonReports.id, body.id));

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
