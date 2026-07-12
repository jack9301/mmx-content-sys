# Cloudflare Pages Functions for Comments

This directory contains Cloudflare Pages Functions that handle the comment system API.

## Files

- `functions/api/comments.js` — handles GET (list approved) and POST (submit, requires moderation)
- `functions/api/comments/admin.js` — handles GET (all), PATCH (change status), DELETE (auth required)

## Required Cloudflare Setup

### 1. Create a KV Namespace

1. In Cloudflare Dashboard: https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces
2. Click "Create a namespace"
3. Name: `COMMENTS_KV`
4. Copy the namespace ID

### 2. Bind the KV to your Pages project

1. Pages → your project → Settings → Functions → KV namespace bindings
2. Variable name: `COMMENTS_KV`
3. KV namespace: select `COMMENTS_KV`
4. Save

### 3. Set the admin token (Environment variables)

Already done if you set `COMMENTS_ADMIN_TOKEN` earlier. Default fallback is `change-me-in-env` (insecure).

## How it works

- Comments stored at KV key: `{locale}/{slug}` (e.g. `en/on-slow-looking`)
- Rate limit at KV key: `rate:{ip}` with 60s TTL
- All new comments start as `status: "pending"` — invisible to public
- Admin approves/rejects/deletes via the admin panel

## API Reference

### Public
- `GET /api/comments?slug=X&locale=Y` → list approved comments for an article
- `POST /api/comments` with `{slug, locale, author, content}` → submit new comment (returns `pending`)

### Admin (Authorization: Bearer YOUR_TOKEN)
- `GET /api/comments/admin` → list all comments across all articles
- `PATCH /api/comments/admin` with `{id, slug, locale, status}` → change status
- `DELETE /api/comments/admin?id=X&slug=Y&locale=Z` → delete comment

## Local development

Cloudflare Functions don't run with `next dev`. For local testing:
- Use `wrangler pages dev` after running `next build`
- Or test the production build deployed to Cloudflare

## Backup / Restore

To backup all comments: list all keys in the KV namespace and download.
To restore: re-upload the JSON values.