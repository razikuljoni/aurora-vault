import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const inbox = knowledgeStore.getInbox();
  return NextResponse.json({ inbox });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === 'TRIAGE' && body.id) {
      const result = knowledgeStore.triageInboxItem(body.id, body.triageAction || 'CONVERT_TO_NOTE');
      return NextResponse.json(result);
    }
    const item = knowledgeStore.createInboxItem(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
