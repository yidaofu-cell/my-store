import { NextResponse } from 'next/server';
import { getDb, landingContent } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = getDb();
    const result = await db.select().from(landingContent);
    const content: Record<string, any> = {};
    for (const row of result) {
      content[row.sectionKey] = row.contentJson;
    }
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({});
  }
}
