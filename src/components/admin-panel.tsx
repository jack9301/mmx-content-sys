'use client';

import { useState, useEffect } from 'react';
import type { Comment } from '@/lib/comments/types';

type Enriched = Comment & { url: string };

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

export function AdminPanel() {
  const [comments, setComments] = useState<Enriched[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [token, setToken] = useState('');
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('admin_token') || '';
    setToken(t);
    if (t) loadFromApi(t);
    else loadFromLocal();
  }, []);

  async function loadFromApi(t: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/comments/admin', { headers: { Authorization: `Bearer ${t}` } });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setApiAvailable(true);
      } else {
        loadFromLocal();
      }
    } catch {
      loadFromLocal();
    } finally {
      setLoading(false);
    }
  }

  function loadFromLocal() {
    setApiAvailable(false);
    try {
      const raw = localStorage.getItem('local_comments') || '[]';
      setComments(JSON.parse(raw));
    } catch {
      setComments([]);
    }
  }

  function saveLocal(updated: Enriched[]) {
    localStorage.setItem('local_comments', JSON.stringify(updated));
    setComments(updated);
  }

  async function setStatus(c: Enriched, status: 'pending' | 'approved' | 'rejected') {
    if (apiAvailable && token) {
      const res = await fetch('/api/comments/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: c.id, slug: c.slug, locale: c.locale, status }),
      });
      if (res.ok) {
        setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, status } : x)));
        return;
      }
    }
    // Local fallback
    saveLocal(comments.map((x) => (x.id === c.id ? { ...x, status } : x)));
  }

  async function remove(c: Enriched) {
    if (!confirm('Delete this comment permanently?')) return;
    if (apiAvailable && token) {
      const res = await fetch(`/api/comments/admin?id=${c.id}&slug=${c.slug}&locale=${c.locale}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setComments((prev) => prev.filter((x) => x.id !== c.id));
        return;
      }
    }
    saveLocal(comments.filter((x) => x.id !== c.id));
  }

  function setTokenAndSave() {
    localStorage.setItem('admin_token', token);
    if (token) loadFromApi(token);
  }

  const filtered = comments.filter((c) => filter === 'all' || c.status === filter);
  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    rejected: comments.filter((c) => c.status === 'rejected').length,
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl">Comment Moderation</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {apiAvailable
            ? 'Connected to API. Approve/reject to publish or hide comments.'
            : 'Static host mode: changes save to localStorage. Deploy with serverless API for production.'}
        </p>
      </header>

      {!apiAvailable && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <label className="mb-1 block font-medium">Admin token (optional, for production API access)</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Set COMMENTS_ADMIN_TOKEN in your env"
              className="flex-1 rounded border border-amber-300 px-2 py-1 text-sm"
            />
            <button
              onClick={setTokenAndSave}
              className="rounded bg-amber-600 px-3 py-1 text-sm text-white hover:bg-amber-700"
            >
              Connect
            </button>
          </div>
        </div>
      )}

      <nav className="mb-6 flex gap-2 border-b border-neutral-200">
        {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm capitalize ${
              filter === f
                ? 'border-b-2 border-accent font-medium text-accent'
                : 'text-neutral-600 hover:text-neutral-900:text-neutral-100'
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-neutral-500">No comments match this filter.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((c) => (
            <li key={c.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{c.author}</span>
                <span className="text-neutral-400">·</span>
                <span className="text-neutral-500">{c.url}</span>
                <span className="text-neutral-400">·</span>
                <time className="text-neutral-500">{new Date(c.createdAt).toLocaleString()}</time>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                    c.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : c.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <p className="mb-3 whitespace-pre-wrap text-sm text-neutral-700">{c.content}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {c.status !== 'approved' && (
                  <button
                    onClick={() => setStatus(c, 'approved')}
                    className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                )}
                {c.status !== 'rejected' && (
                  <button
                    onClick={() => setStatus(c, 'rejected')}
                    className="rounded bg-amber-600 px-3 py-1 text-white hover:bg-amber-700"
                  >
                    Reject
                  </button>
                )}
                {c.status !== 'pending' && (
                  <button
                    onClick={() => setStatus(c, 'pending')}
                    className="rounded border border-neutral-300 px-3 py-1 text-neutral-700 hover:bg-neutral-50:bg-neutral-800/40"
                  >
                    Mark pending
                  </button>
                )}
                <button
                  onClick={() => remove(c)}
                  className="ml-auto rounded bg-rose-600 px-3 py-1 text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}