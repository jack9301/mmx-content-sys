'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import type { Comment } from '@/lib/comments/types';

type Props = { slug: string; locale: string };

export function Comments({ slug, locale }: Props) {
  const t = useTranslations('article');
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, startSubmit] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}&locale=${locale}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [slug, locale]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startSubmit(async () => {
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, locale, author, content }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setMessage({ type: 'ok', text: data.message || 'Thanks! Your comment is awaiting review.' });
          setAuthor('');
          setContent('');
        } else {
          setMessage({ type: 'err', text: data.error || `Something went wrong (${res.status}).` });
        }
      } catch (err) {
        setMessage({ type: 'err', text: 'Network error. Please try again.' });
      }
    });
  }

  return (
    <section className="mx-auto mt-16 max-w-2xl border-t border-neutral-200 pt-12">
      <h2 className="mb-2 font-serif text-2xl text-neutral-900">{t('comments')}</h2>
      <p className="mb-6 text-sm text-neutral-500">{t('commentNote')}</p>

      <form onSubmit={submit} className="mb-10 space-y-3 rounded-lg border border-neutral-200 bg-white p-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{t('name')}</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={60}
            required
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            placeholder={t('namePlaceholder')}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{t('yourComment')}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            required
            rows={4}
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            placeholder={t('commentPlaceholder')}
          />
        </div>
        {message && (
          <p className={`text-sm ${message.type === 'ok' ? 'text-emerald-700' : 'text-rose-700'}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {submitting ? t('submitting') : t('submit')}
        </button>
      </form>

      <div>
        {loading ? (
          <p className="text-sm text-neutral-500">Loading…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-neutral-500">{t('noComments')}</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="mb-1 flex items-center gap-2 text-sm">
                  <span className="font-medium text-neutral-900">{c.author}</span>
                  <span className="text-neutral-400">·</span>
                  <time className="text-neutral-500">
                    {new Date(c.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm text-neutral-700">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function CommentsWrapper(props: Props) {
  return <Comments {...props} />;
}