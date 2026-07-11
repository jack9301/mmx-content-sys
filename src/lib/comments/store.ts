import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { Comment, CommentStore } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'comments');

function filePath(slug: string, locale: string): string {
  return path.join(DATA_DIR, locale, `${slug}.json`);
}

export async function getComments(slug: string, locale: string, onlyApproved = true): Promise<Comment[]> {
  const fp = filePath(slug, locale);
  try {
    const raw = await fs.readFile(fp, 'utf8');
    const store: CommentStore = JSON.parse(raw);
    return onlyApproved
      ? store.comments.filter((c) => c.status === 'approved')
      : store.comments;
  } catch {
    return [];
  }
}

export async function getAllComments(): Promise<Array<Comment & { url: string }>> {
  try {
    const locales = await fs.readdir(DATA_DIR);
    const all: Array<Comment & { url: string }> = [];
    for (const locale of locales) {
      const dir = path.join(DATA_DIR, locale);
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const slug = file.replace(/\.json$/, '');
        const raw = await fs.readFile(path.join(dir, file), 'utf8');
        const store: CommentStore = JSON.parse(raw);
        for (const c of store.comments) {
          all.push({ ...c, url: `/${locale}/articles/${slug}` });
        }
      }
    }
    return all.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } catch {
    return [];
  }
}

export async function addComment(input: Omit<Comment, 'id' | 'createdAt' | 'status'>): Promise<Comment> {
  const comment: Comment = {
    ...input,
    id: crypto.randomBytes(8).toString('hex'),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  const fp = filePath(input.slug, input.locale);
  await fs.mkdir(path.dirname(fp), { recursive: true });
  let store: CommentStore = { comments: [] };
  try {
    const raw = await fs.readFile(fp, 'utf8');
    store = JSON.parse(raw);
  } catch {}
  store.comments.push(comment);
  await fs.writeFile(fp, JSON.stringify(store, null, 2));
  return comment;
}

export async function updateCommentStatus(
  id: string,
  locale: string,
  slug: string,
  status: 'pending' | 'approved' | 'rejected',
): Promise<Comment | null> {
  const fp = filePath(slug, locale);
  try {
    const raw = await fs.readFile(fp, 'utf8');
    const store: CommentStore = JSON.parse(raw);
    const idx = store.comments.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store.comments[idx].status = status;
    await fs.writeFile(fp, JSON.stringify(store, null, 2));
    return store.comments[idx];
  } catch {
    return null;
  }
}

export async function deleteComment(id: string, locale: string, slug: string): Promise<boolean> {
  const fp = filePath(slug, locale);
  try {
    const raw = await fs.readFile(fp, 'utf8');
    const store: CommentStore = JSON.parse(raw);
    const before = store.comments.length;
    store.comments = store.comments.filter((c) => c.id !== id);
    if (store.comments.length === before) return false;
    await fs.writeFile(fp, JSON.stringify(store, null, 2));
    return true;
  } catch {
    return false;
  }
}

// Simple in-memory rate limit (resets on server restart)
const rateMap = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;

export function checkRate(key: string): boolean {
  const now = Date.now();
  const arr = rateMap.get(key) ?? [];
  const recent = arr.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    rateMap.set(key, recent);
    return false;
  }
  recent.push(now);
  rateMap.set(key, recent);
  return true;
}

// Simple profanity / spam filter
const BLOCKED = ['viagra', 'casino', 'crypto airdrop', 'click here to earn', 'http://', 'https://'];
export function isSpam(content: string): boolean {
  const lower = content.toLowerCase();
  return BLOCKED.some((term) => lower.includes(term));
}