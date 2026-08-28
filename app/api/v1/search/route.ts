import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const results = knowledgeStore.search(q);
  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, query, filters } = body;
    const saved = knowledgeStore.saveSearch(name, query, filters || {});
    return NextResponse.json({ savedSearch: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
