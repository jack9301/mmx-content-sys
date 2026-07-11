# Custom Comments System

Self-hosted comment system. All comments require admin approval before appearing publicly.

## How it works

- Anyone can submit a comment (no login required)
- All comments go to `pending` status — invisible to public
- Admin logs in at `/en/admin/comments?token=YOUR_TOKEN` to approve/reject
- Approved comments appear publicly under each article
- File-based storage at `data/comments/{locale}/{slug}.json` (no database needed)

## Setup

1. Set a secure admin token in `.env.local` (or your Cloudflare Pages env):
   ```
   COMMENTS_ADMIN_TOKEN=your-long-random-string-here
   ```
   Default fallback (INSECURE — change in production): `change-me-in-env`

2. Access admin panel: `https://yoursite.com/en/admin/comments?token=YOUR_TOKEN`
   - Bookmark this URL with the token in the query string for one-click access
   - The admin form also accepts the token via a password input

3. View public comments under any article (only `approved` ones)

## Features

- ✅ File-based (no DB)
- ✅ Per-article + per-locale storage
- ✅ Rate limit: 3 comments per minute per IP
- ✅ Spam filter (blocks common spam keywords + URLs)
- ✅ Length limits: name 2-60 chars, comment 3-2000 chars
- ✅ Approval workflow: pending → approved/rejected
- ✅ Admin can delete permanently
- ✅ i18n (English / 中文 / 日本語)

## File layout

```
data/comments/
  en/
    on-slow-looking.json
    the-grammar-of-rain.json
  zh/
    on-slow-looking.json
  ja/
    on-slow-looking.json
```

Each file:
```json
{
  "comments": [
    {
      "id": "abc123",
      "slug": "on-slow-looking",
      "locale": "en",
      "author": "Jane",
      "content": "Beautiful piece.",
      "createdAt": "2026-07-11T09:00:00Z",
      "status": "approved",
      "userAgent": "Mozilla/5.0...",
      "ipHash": "192.168.1.1"
    }
  ]
}
```

## API

- `GET /api/comments?slug=X&locale=Y` — list approved comments
- `POST /api/comments` — submit new comment (returns `pending` status)
- `PATCH /api/comments/admin` (auth required) — change status
- `DELETE /api/comments/admin?id=X&slug=Y&locale=Z` (auth required) — delete

## Disabling

To remove: delete `src/components/comments-wrapper.tsx`, `src/components/comments.tsx`, `src/lib/comments/`, `src/app/api/comments/`, and remove `<CommentsWrapper />` from the article page.