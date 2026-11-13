import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Notes — the micro-blog.
 *
 * Short, spontaneous posts. Kept deliberately separate from the main
 * article library so that a 60-word thought never appears in the article
 * feed, category listings, or the "most read" rankings.
 *
 * Notes live in `content/notes/<slug>.md` (plain Markdown, not MDX) and are
 * routed under `/<locale>/notes/`.
 *
 * Required frontmatter: `title`
 * Optional frontmatter: `date`, `tags`, `pin`
 */

export type Note = {
  slug: string;
  title: string;
  /** ISO date. Falls back to the file's mtime. */
  date: string;
  tags: string[];
  /** Pinned notes float to the top of the notes index. */
  pin: boolean;
  content: string;
};

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');

function readNoteFile(slug: string): Note | null {
  const filePath = path.join(NOTES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date
      ? new Date(data.date).toISOString()
      : fs.statSync(filePath).mtime.toISOString(),
    tags: Array.isArray(data.tags) ? data.tags : [],
    pin: data.pin === true,
    content,
  };
}

/**
 * All note slugs. Notes are not localised — there is one shared set.
 */
export function getAllNoteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

/**
 * All notes, newest first. Pinned notes sort above everything else.
 */
export function getAllNotes(): Note[] {
  return getAllNoteSlugs()
    .map((slug) => readNoteFile(slug))
    .filter((n): n is Note => n !== null)
    .sort((a, b) => {
      if (a.pin !== b.pin) return a.pin ? -1 : 1;
      return +new Date(b.date) - +new Date(a.date);
    });
}

export function getNoteBySlug(slug: string): Note | null {
  return readNoteFile(slug);
}

/**
 * The most recent note, used for the homepage teaser.
 */
export function getLatestNote(): Note | null {
  return getAllNotes()[0] ?? null;
}

/**
 * Plain-text preview of a note's body.
 *
 * Strips Markdown syntax so the excerpt can be used in meta tags and feed
 * previews without leaking formatting characters into the text.
 */
export function noteExcerpt(note: Note, maxLength = 200): string {
  const text = note.content
    .replace(/^#+\s+.*$/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[*_`>#\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}...` : text;
}
