# Quiet Pages

A multilingual content website with built-in comment system. Built with Next.js, deployed on Cloudflare Pages.

## Stack

- **Framework**: Next.js 14.2.35 + TypeScript + Tailwind CSS
- **i18n**: next-intl (English, 中文, 日本語)
- **Content**: MDX files in `content/{en,zh,ja}/`
- **Comments**: Custom system, file-less, Cloudflare KV storage
- **Hosting**: Cloudflare Pages (static + Functions)

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — redirects to /en/ by default.

## Build & Deploy

```bash
npm run build
```

The build outputs:
- Static pages to `out/` (HTML, CSS, JS)
- Cloudflare Functions to `functions/`

Deploy to Cloudflare Pages:
1. Connect this repo to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `out`
4. Set environment variable: `COMMENTS_ADMIN_TOKEN` (long random string)
5. Create KV namespace `COMMENTS_KV` and bind it to the project

## Adding a New Article

Create `content/{locale}/your-slug.mdx` for each language:

```mdx
---
title: "Your Title"
excerpt: "Short description for the homepage card."
date: "2026-07-15"
tags: ["essay"]
coverImage: "https://images.unsplash.com/photo-xxx?w=1600"
---

Your article body in markdown. Use # ## ### for headings, > for quotes.
```

## Comment Moderation

Visit `/en/admin/comments?token=YOUR_COMMENTS_ADMIN_TOKEN`

- Default view: pending comments
- Click "Approve" to make public
- Click "Reject" to hide (keeps record)
- Click "Delete" to remove permanently

## File Structure

```
.
├── content/{en,zh,ja}/*.mdx       # Articles
├── functions/                     # Cloudflare Pages Functions (API)
├── messages/{en,zh,ja}.json       # UI translations
├── out/                           # Build output (gitignored)
├── src/
│   ├── app/[locale]/              # Routes (Next.js App Router)
│   ├── components/                # React components
│   ├── i18n/                      # next-intl config
│   └── lib/                       # Utilities
└── next.config.mjs
```