import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const highlight = knowledgeStore.addDocumentHighlight(id, body);
    if (!highlight) {
      return NextResponse.json({ error: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found' } }, { status: 404 });
    }
    return NextResponse.json({ highlight }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
