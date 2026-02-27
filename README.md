# Echo Room

Anonymous community app: browse communities, post, and comment. No sign-up—identity is fingerprint-based.

## Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Postgres, Edge Functions, Storage). Reads use the Supabase client; writes go through Edge Functions only.

## Run

```bash
npm install
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. Apply Supabase migrations for the DB schema and deploy Edge Functions for create-post and create-comment.

## Features

- Communities with post feeds and pagination
- Posts with optional images; nested comments
- Search (newest, oldest, most commented)
- Author country shown as a flag next to the fingerprint badge (geo from IP, stored on post/comment)
