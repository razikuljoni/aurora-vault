import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore, CURRENT_USER } from '@/lib/store';

export async function GET() {
  return NextResponse.json({
    user: CURRENT_USER,
    workspace: knowledgeStore.getWorkspace(),
    workspaces: knowledgeStore.getWorkspaces(),
  });
}
