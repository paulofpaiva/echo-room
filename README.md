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

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. Apply Supabase migrations and deploy Edge Functions. For the news carousel: set **NEWS_API_KEY** in Supabase Edge Function secrets (Dashboard → Project → Edge Functions → Secrets); do not put the News API key in `.env` as `VITE_*` (it would be exposed to the browser).

**Auto-updating news:** The repo includes a GitHub Actions workflow (`.github/workflows/sync-news.yml`) that calls the `sync-news` Edge Function every 6 hours. To enable it, add these **repository secrets** (Settings → Secrets and variables → Actions): `SUPABASE_SYNC_NEWS_URL` = `https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-news`, and `SUPABASE_ANON_KEY` = your Supabase anon key. You can also run the workflow manually from the Actions tab.

## Features

- Communities with post feeds and pagination
- Posts with optional images; nested comments
- Search (newest, oldest, most commented)
- News section (carousel on home, full list and filters at /news); sync via Edge Function `sync-news`
- Author country shown as a flag next to the fingerprint badge (geo from IP, stored on post/comment)
