import { NextRequest, NextResponse } from 'next/server';
import { addComment, checkRate, getComments, isSpam } from '@/lib/comments/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale');
  if (!slug || !locale) {
    return NextResponse.json({ error: 'slug and locale required' }, { status: 400 });
  }
  const comments = await getComments(slug, locale, true);
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, locale, author, content, parentId } = body;
    if (!slug || !locale || !author || !content) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }
    const trimmedAuthor = String(author).trim().slice(0, 60);
    const trimmedContent = String(content).trim();
    if (trimmedAuthor.length < 2) {
      return NextResponse.json({ error: 'name too short' }, { status: 400 });
    }
    if (trimmedContent.length < 3) {
      return NextResponse.json({ error: 'comment too short' }, { status: 400 });
    }
    if (trimmedContent.length > 2000) {
      return NextResponse.json({ error: 'comment too long (max 2000)' }, { status: 400 });
    }
    if (isSpam(trimmedAuthor) || isSpam(trimmedContent)) {
      return NextResponse.json({ error: 'comment rejected' }, { status: 400 });
    }
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    if (!checkRate(ip)) {
      return NextResponse.json({ error: 'too many requests, slow down' }, { status: 429 });
    }
    const comment = await addComment({
      slug,
      locale,
      author: trimmedAuthor,
      content: trimmedContent,
      parentId,
      userAgent: req.headers.get('user-agent') || undefined,
      ipHash: ip,
    });
    return NextResponse.json({ comment, message: 'Comment submitted. Pending approval.' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}