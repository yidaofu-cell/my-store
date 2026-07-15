import { NextResponse } from 'next/server';
import { getDb, products, productFeatures, productSpecs } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = getDb();
    const allProducts = await db.select().from(products).where(eq(products.isActive, true)).limit(1);
    if (allProducts.length === 0) {
      return NextResponse.json(null);
    }

    const product = allProducts[0];
    const features = await db.select().from(productFeatures).where(eq(productFeatures.productId, product.id)).orderBy(productFeatures.sortOrder);
    const specs = await db.select().from(productSpecs).where(eq(productSpecs.productId, product.id)).orderBy(productSpecs.sortOrder);

    return NextResponse.json({
      ...product,
      features: features.map((f: any) => f.label),
      specs: specs.map((s: any) => ({ label: s.label, value: s.value })),
    });
  } catch {
    return NextResponse.json(null);
  }
}
