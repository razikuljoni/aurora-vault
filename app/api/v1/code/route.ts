import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const codeSnippets = knowledgeStore.getCodeSnippets();
  return NextResponse.json({ codeSnippets });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const snippet = knowledgeStore.createCodeSnippet(body);
    return NextResponse.json({ snippet }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
