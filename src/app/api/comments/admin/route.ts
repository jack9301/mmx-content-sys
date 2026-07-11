import { NextRequest, NextResponse } from 'next/server';
import { updateCommentStatus, deleteComment } from '@/lib/comments/store';

const ADMIN_TOKEN = process.env.COMMENTS_ADMIN_TOKEN || 'change-me-in-env';

function authOk(req: NextRequest): boolean {
  const header = req.headers.get('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  return token === ADMIN_TOKEN;
}

export async function PATCH(req: NextRequest) {
  if (!authOk(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { id, slug, locale, status } = body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    const updated = await updateCommentStatus(id, locale, slug, status);
    if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ comment: updated });
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!authOk(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale');
  if (!id || !slug || !locale) {
    return NextResponse.json({ error: 'id, slug, locale required' }, { status: 400 });
  }
  const ok = await deleteComment(id, locale, slug);
  if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}