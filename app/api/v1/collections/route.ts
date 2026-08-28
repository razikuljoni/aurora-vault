import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const collections = knowledgeStore.getCollections();
  return NextResponse.json({ collections });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const collection = knowledgeStore.createCollection(body);
    return NextResponse.json({ collection }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
