import { NextRequest, NextResponse } from 'next/server';
import { db, products, productFeatures, productSpecs } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(products).orderBy(products.createdAt);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [product] = await db.insert(products).values({
      name: body.name,
      subtitle: body.subtitle || '',
      description: body.description || '',
      price: body.price,
      compareAtPrice: body.compareAtPrice || null,
      currency: body.currency || 'USD',
      imageUrl: body.imageUrl || '',
      isActive: body.isActive !== false,
    }).returning();

    // Insert features
    if (body.features?.length) {
      for (let i = 0; i < body.features.length; i++) {
        await db.insert(productFeatures).values({
          productId: product.id,
          label: body.features[i],
          sortOrder: i,
        });
      }
    }

    // Insert specs
    if (body.specs?.length) {
      for (let i = 0; i < body.specs.length; i++) {
        await db.insert(productSpecs).values({
          productId: product.id,
          label: body.specs[i].label,
          value: body.specs[i].value,
          sortOrder: i,
        });
      }
    }

    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
