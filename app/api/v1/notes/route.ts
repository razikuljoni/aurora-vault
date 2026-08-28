import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const notes = knowledgeStore.getNotes();
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: { code: 'VALIDATION_FAILED', message: 'Title is required' } }, { status: 400 });
    }
    const note = knowledgeStore.createNote(body);
    return NextResponse.json({ note }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
