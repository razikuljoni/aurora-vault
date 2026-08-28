import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { versionId } = body;
    if (!versionId) {
      return NextResponse.json({ error: { code: 'VALIDATION_FAILED', message: 'versionId is required' } }, { status: 400 });
    }
    const restored = knowledgeStore.restoreNoteVersion(id, versionId);
    if (!restored) {
      return NextResponse.json({ error: { code: 'VERSION_NOT_FOUND', message: 'Version not found' } }, { status: 404 });
    }
    return NextResponse.json({ note: restored });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
