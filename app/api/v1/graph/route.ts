import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const graph = knowledgeStore.getKnowledgeGraph();
  return NextResponse.json({ graph });
}
