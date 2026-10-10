import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type Article = {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
  content: string;
  readingTime: number;
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readArticleFile(slug: string, locale: string): Article | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    locale,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? data.cover,
    content,
    readingTime: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

export function getAllArticleSlugs(): string[] {
  const seen = new Set<string>();
  for (const locale of ['en', 'zh', 'ja']) {
    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.mdx')) seen.add(file.replace(/\.mdx$/, ''));
    }
  }
  return Array.from(seen);
}

export function getAllArticles(locale: string): Article[] {
  return getAllArticleSlugs()
    .map((slug) => readArticleFile(slug, locale))
    .filter((a): a is Article => a !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getArticleBySlug(slug: string, locale: string): Article | null {
  return readArticleFile(slug, locale);
}