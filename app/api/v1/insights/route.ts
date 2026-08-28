import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const insights = knowledgeStore.getDeterministicInsights();
  return NextResponse.json({ insights });
}
