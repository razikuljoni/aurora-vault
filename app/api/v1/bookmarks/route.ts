import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const bookmarks = knowledgeStore.getBookmarks();
  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookmark = knowledgeStore.createBookmark(body);
    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
