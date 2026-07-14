import { NextRequest, NextResponse } from 'next/server';
import { db, landingContent } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(landingContent).orderBy(landingContent.sectionKey);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await db.update(landingContent)
      .set({ contentJson: body.contentJson as any, updatedAt: new Date() })
      .where(eq(landingContent.sectionKey, body.sectionKey));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
