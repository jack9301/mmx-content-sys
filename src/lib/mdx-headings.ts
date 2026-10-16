/**
 * Extract H2 and H3 headings from MDX content for the in-article TOC.
 * - Skips headings inside code blocks (fenced with ```).
 * - Generates the same slug rehype-slug would, so anchors match.
 */
export type TocHeading = { id: string; text: string; level: 2 | 3 };

const FENCE = /^```/;

export function extractHeadings(mdx: string): TocHeading[] {
  const lines = mdx.split('\n');
  const headings: TocHeading[] = [];
  let inFence = false;
  for (const line of lines) {
    if (FENCE.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = stripInlineFormatting(match[2]);
    const id = slugify(text);
    if (!id) continue;
    headings.push({ id, text, level });
  }
  return headings;
}

function stripInlineFormatting(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff]+/g, '-')
    .replace(/^-+|-+$/g, '');
}