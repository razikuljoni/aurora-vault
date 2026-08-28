import { NextRequest, NextResponse } from 'next/server';
import { knowledgeStore } from '@/lib/store';

export async function GET() {
  const members = knowledgeStore.getMembers();
  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;
    if (!email) {
      return NextResponse.json({ error: { code: 'VALIDATION_FAILED', message: 'Email is required' } }, { status: 400 });
    }
    const member = knowledgeStore.inviteMember(email, role || 'EDITOR');
    return NextResponse.json({ member }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberId, role } = body;
    if (!memberId || !role) {
      return NextResponse.json({ error: { code: 'VALIDATION_FAILED', message: 'memberId and role are required' } }, { status: 400 });
    }
    const member = knowledgeStore.updateMemberRole(memberId, role);
    return NextResponse.json({ member });
  } catch (err: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
