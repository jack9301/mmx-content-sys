'use client';

import { useEffect, useState } from 'react';

type Heading = { id: string; text: string; level: 2 | 3 };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first heading whose top is at or above the top quarter of the viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
          return;
        }
        // Fallback: find the heading whose top is just above the top of the viewport
        let candidate: string | null = activeId;
        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.25) {
            candidate = el.id;
          } else {
            break;
          }
        }
        if (candidate) setActiveId(candidate);
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 1.0],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings.length]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-20 hidden lg:block"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-neutral-200 text-sm">
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.level === 3 ? 'pl-6' : 'pl-3'}
          >
            <a
              href={`#${h.id}`}
              className={[
                '-ml-px block border-l py-1 pl-3 transition-colors',
                activeId === h.id
                  ? 'border-[#0f766e] font-medium text-[#0f766e]'
                  : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
              ].join(' ')}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}