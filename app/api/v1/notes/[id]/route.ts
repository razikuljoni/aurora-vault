import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = knowledgeStore.getNoteById(id);
  if (!note) {
    return NextResponse.json({ error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } }, { status: 404 });
  }
  const backlinks = knowledgeStore.getBacklinksForNote(id);
  const versions = knowledgeStore.getNoteVersions(id);
  return NextResponse.json({ note, backlinks, versions });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = knowledgeStore.updateNote(id, body);
    if (!updated) {
      return NextResponse.json({ error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } }, { status: 404 });
    }
    return NextResponse.json({ note: updated });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = knowledgeStore.deleteNote(id);
  if (!success) {
    return NextResponse.json({ error: { code: 'NOTE_NOT_FOUND', message: 'Note not found' } }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
