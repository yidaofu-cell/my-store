import { NextRequest, NextResponse } from 'next/server';
import { getDb, wbReports } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.select().from(wbReports).orderBy(wbReports.month);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

function calc(body: any) {
  const wbNetRub = (body.salesRevenue || 0)
    - (body.lossesDefects || 0)
    - (body.logisticsFee || 0)
    - (body.storageFee || 0)
    - (body.inboundFee || 0)
    - (body.fines || 0)
    - (body.commissionAcquiring || 0)
    - (body.deductions || 0)
    - (body.membershipFee || 0);

  const rate = body.exchangeRate || 0.08;
  const wbNetRmb = wbNetRub * rate;
  const totalAdditionalCost = (body.purchaseCost || 0) + (body.shippingCost || 0) + (body.laborCost || 0) + (body.marketingCost || 0) + (body.otherCost || 0);
  const netProfit = wbNetRmb - totalAdditionalCost;
  const totalRevenueRmb = (body.salesRevenue || 0) * rate;
  const profitMargin = totalRevenueRmb > 0 ? (netProfit / totalRevenueRmb) * 100 : 0;

  return { wbNetRub, wbNetRmb, totalAdditionalCost, netProfit, profitMargin };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();
    const year = parseInt(body.month?.split('-')[0]);
    const monthNum = parseInt(body.month?.split('-')[1]);
    const c = calc(body);

    const [report] = await db.insert(wbReports).values({
      month: body.month, year, monthNum,
      salesRevenue: body.salesRevenue || 0,
      lossesDefects: body.lossesDefects || 0,
      logisticsFee: body.logisticsFee || 0,
      storageFee: body.storageFee || 0,
      inboundFee: body.inboundFee || 0,
      fines: body.fines || 0,
      commissionAcquiring: body.commissionAcquiring || 0,
      deductions: body.deductions || 0,
      membershipFee: body.membershipFee || 0,
      exchangeRate: body.exchangeRate || 0.08,
      purchaseCost: body.purchaseCost || 0,
      shippingCost: body.shippingCost || 0,
      laborCost: body.laborCost || 0,
      marketingCost: body.marketingCost || 0,
      otherCost: body.otherCost || 0,
      wbNetRub: c.wbNetRub,
      wbNetRmb: c.wbNetRmb,
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
      lossesDefects: body.lossesDefects || 0,
      logisticsFee: body.logisticsFee || 0,
      storageFee: body.storageFee || 0,
      inboundFee: body.inboundFee || 0,
      fines: body.fines || 0,
      commissionAcquiring: body.commissionAcquiring || 0,
      deductions: body.deductions || 0,
      membershipFee: body.membershipFee || 0,
      exchangeRate: body.exchangeRate || 0.08,
      purchaseCost: body.purchaseCost || 0,
      shippingCost: body.shippingCost || 0,
      laborCost: body.laborCost || 0,
      marketingCost: body.marketingCost || 0,
      otherCost: body.otherCost || 0,
      wbNetRub: c.wbNetRub,
      wbNetRmb: c.wbNetRmb,
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

    await db.update(wbReports).set(setData).where(eq(wbReports.id, body.id));
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
    await db.delete(wbReports).where(eq(wbReports.id, id));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
