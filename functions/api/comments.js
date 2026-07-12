// Cloudflare Pages Function for /api/comments
// Handles GET (list) and POST (submit) for comments
// Storage: Cloudflare KV or R2 (recommended) or D1 (recommended for queries)
// For simplicity, using Cloudflare KV - bind it as COMMENTS_KV in the Pages dashboard

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // List comments: GET /api/comments?slug=X&locale=Y
  if (request.method === 'GET') {
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale');
    if (!slug || !locale) {
      return jsonResponse({ error: 'slug and locale required' }, 400, corsHeaders);
    }
    const key = `${locale}/${slug}`;
    const data = await env.COMMENTS_KV.get(key);
    const comments = data ? JSON.parse(data).filter((c) => c.status === 'approved') : [];
    return jsonResponse({ comments }, 200, corsHeaders);
  }

  // Submit comment: POST /api/comments
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { slug, locale, author, content, parentId } = body;
      if (!slug || !locale || !author || !content) {
        return jsonResponse({ error: 'missing fields' }, 400, corsHeaders);
      }
      const trimmedAuthor = String(author).trim().slice(0, 60);
      const trimmedContent = String(content).trim();
      if (trimmedAuthor.length < 2) {
        return jsonResponse({ error: 'name too short' }, 400, corsHeaders);
      }
      if (trimmedContent.length < 3) {
        return jsonResponse({ error: 'comment too short' }, 400, corsHeaders);
      }
      if (trimmedContent.length > 2000) {
        return jsonResponse({ error: 'comment too long (max 2000)' }, 400, corsHeaders);
      }
      // Spam filter
      const blocked = ['viagra', 'casino', 'crypto airdrop', 'click here to earn', 'http://', 'https://'];
      const lower = (trimmedAuthor + ' ' + trimmedContent).toLowerCase();
      if (blocked.some((term) => lower.includes(term))) {
        return jsonResponse({ error: 'comment rejected' }, 400, corsHeaders);
      }
      // Rate limit (per IP, 3 per minute)
      const ip = request.headers.get('cf-connecting-ip') || 'local';
      const rateKey = `rate:${ip}`;
      const rateData = await env.COMMENTS_KV.get(rateKey);
      const recent = rateData ? JSON.parse(rateData) : [];
      const now = Date.now();
      const filtered = recent.filter((t) => now - t < 60000);
      if (filtered.length >= 3) {
        return jsonResponse({ error: 'too many requests, slow down' }, 429, corsHeaders);
      }
      filtered.push(now);
      await env.COMMENTS_KV.put(rateKey, JSON.stringify(filtered), { expirationTtl: 60 });

      // Save comment
      const comment = {
        id: Math.random().toString(36).slice(2, 18),
        slug,
        locale,
        author: trimmedAuthor,
        content: trimmedContent,
        parentId: parentId || undefined,
        createdAt: new Date().toISOString(),
        status: 'pending',
        ipHash: ip,
      };
      const key = `${locale}/${slug}`;
      const existing = await env.COMMENTS_KV.get(key);
      const store = existing ? JSON.parse(existing) : { comments: [] };
      store.comments.push(comment);
      await env.COMMENTS_KV.put(key, JSON.stringify(store));
      return jsonResponse(
        { comment, message: 'Comment submitted. Pending approval.' },
        201,
        corsHeaders
      );
    } catch (e) {
      return jsonResponse({ error: 'invalid request' }, 400, corsHeaders);
    }
  }

  return jsonResponse({ error: 'method not allowed' }, 405, corsHeaders);
}

function jsonResponse(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}