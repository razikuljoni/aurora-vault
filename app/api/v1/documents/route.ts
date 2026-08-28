import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const documents = knowledgeStore.getDocuments();
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc = knowledgeStore.createDocument(body);
    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
