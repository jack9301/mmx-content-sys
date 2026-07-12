// Cloudflare Pages Function for /api/comments/admin
// Handles PATCH (change status) and DELETE (remove) with admin auth
// Requires COMMENTS_ADMIN_TOKEN env var
// Storage: COMMENTS_KV (Cloudflare KV)

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Auth check
  const adminToken = env.COMMENTS_ADMIN_TOKEN || 'change-me-in-env';
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token !== adminToken) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  // List all comments: GET /api/comments/admin
  if (request.method === 'GET') {
    const list = await env.COMMENTS_KV.list();
    const all = [];
    for (const key of list.keys) {
      if (key.name.startsWith('rate:')) continue;
      const data = await env.COMMENTS_KV.get(key.name);
      if (!data) continue;
      try {
        const store = JSON.parse(data);
        const [locale, ...slugParts] = key.name.split('/');
        const slug = slugParts.join('/');
        for (const c of store.comments || []) {
          all.push({ ...c, url: `/${locale}/articles/${slug}` });
        }
      } catch {}
    }
    all.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return jsonResponse({ comments: all }, 200, corsHeaders);
  }

  // Change status: PATCH /api/comments/admin
  if (request.method === 'PATCH') {
    try {
      const body = await request.json();
      const { id, slug, locale, status } = body;
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return jsonResponse({ error: 'invalid status' }, 400, corsHeaders);
      }
      const key = `${locale}/${slug}`;
      const data = await env.COMMENTS_KV.get(key);
      if (!data) return jsonResponse({ error: 'not found' }, 404, corsHeaders);
      const store = JSON.parse(data);
      const idx = store.comments.findIndex((c) => c.id === id);
      if (idx === -1) return jsonResponse({ error: 'not found' }, 404, corsHeaders);
      store.comments[idx].status = status;
      await env.COMMENTS_KV.put(key, JSON.stringify(store));
      return jsonResponse({ comment: store.comments[idx] }, 200, corsHeaders);
    } catch {
      return jsonResponse({ error: 'invalid request' }, 400, corsHeaders);
    }
  }

  // Delete: DELETE /api/comments/admin?id=X&slug=Y&locale=Z
  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale');
    if (!id || !slug || !locale) {
      return jsonResponse({ error: 'id, slug, locale required' }, 400, corsHeaders);
    }
    const key = `${locale}/${slug}`;
    const data = await env.COMMENTS_KV.get(key);
    if (!data) return jsonResponse({ error: 'not found' }, 404, corsHeaders);
    const store = JSON.parse(data);
    const before = store.comments.length;
    store.comments = store.comments.filter((c) => c.id !== id);
    if (store.comments.length === before) {
      return jsonResponse({ error: 'not found' }, 404, corsHeaders);
    }
    await env.COMMENTS_KV.put(key, JSON.stringify(store));
    return jsonResponse({ ok: true }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'method not allowed' }, 405, corsHeaders);
}

function jsonResponse(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}