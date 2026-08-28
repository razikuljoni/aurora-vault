import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const auditLogs = knowledgeStore.getAuditLogs();
  return NextResponse.json({ auditLogs });
}
