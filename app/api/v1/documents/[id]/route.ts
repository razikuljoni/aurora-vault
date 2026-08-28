import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = knowledgeStore.getDocumentById(id);
  if (!doc) {
    return NextResponse.json({ error: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found' } }, { status: 404 });
  }
  return NextResponse.json({ document: doc });
}
