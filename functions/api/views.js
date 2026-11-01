// Cloudflare Pages Function for /api/views
// Handles GET (read counts) and POST (increment a view count)
// Storage: Cloudflare KV — bind it as VIEWS_KV in the Pages dashboard.
//
// Design notes:
// - Counting happens client-side on the article page (a single POST per view).
// - A short dedupe window per IP prevents refresh loops inflating the number.
// - Counts are approximate by design: they represent page loads, not unique
//   readers, and are intended as a relative popularity signal only.
//
// Storage fallback: if a dedicated VIEWS_KV binding is not configured, this
// falls back to the existing COMMENTS_KV namespace so the feature works
// immediately without dashboard changes. Keys are namespaced with a `view:`
// prefix, which cannot collide with comment keys (`<locale>/<slug>` and
// `rate:<ip>`).

const DEDUPE_TTL_SECONDS = 60 * 30; // 30 min per IP per slug

function getKv(env) {
  return env.VIEWS_KV || env.COMMENTS_KV || null;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Read counts: GET /api/views?slugs=en/a,en/b
  if (request.method === 'GET') {
    const slugs = (url.searchParams.get('slugs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 100);

    if (slugs.length === 0) {
      return jsonResponse({ views: {} }, 200, corsHeaders);
    }

    const kv = getKv(env);
    if (!kv) return jsonResponse({ views: {} }, 200, corsHeaders);

    const views = {};
    await Promise.all(
      slugs.map(async (key) => {
        const raw = await kv.get(`view:${key}`);
        views[key] = raw ? Number(raw) || 0 : 0;
      })
    );
    return jsonResponse({ views }, 200, corsHeaders);
  }

  // Increment: POST /api/views
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { slug, locale } = body;
      if (!slug || !locale) {
        return jsonResponse({ error: 'slug and locale required' }, 400, corsHeaders);
      }

      const kv = getKv(env);
      if (!kv) return jsonResponse({ error: 'storage not configured' }, 503, corsHeaders);

      const key = `${locale}/${slug}`;
      const ip = request.headers.get('cf-connecting-ip') || 'local';

      // Dedupe: one count per IP per slug per 30 minutes.
      const seenKey = `viewseen:${ip}:${key}`;
      const alreadySeen = await kv.get(seenKey);
      if (alreadySeen) {
        const current = await kv.get(`view:${key}`);
        return jsonResponse({ views: current ? Number(current) || 0 : 0, counted: false }, 200, corsHeaders);
      }
      await kv.put(seenKey, '1', { expirationTtl: DEDUPE_TTL_SECONDS });

      // Increment the counter.
      const countKey = `view:${key}`;
      const currentRaw = await kv.get(countKey);
      const next = (currentRaw ? Number(currentRaw) || 0 : 0) + 1;
      await kv.put(countKey, String(next));

      return jsonResponse({ views: next, counted: true }, 200, corsHeaders);
    } catch {
      return jsonResponse({ error: 'invalid request' }, 400, corsHeaders);
    }
  }

  return jsonResponse({ error: 'method not allowed' }, 405, corsHeaders);
}

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
