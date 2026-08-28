import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const activity = knowledgeStore.getActivity();
  return NextResponse.json({ activity });
}
