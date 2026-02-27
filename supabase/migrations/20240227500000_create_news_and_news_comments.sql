-- News: articles from external API (sync job). Read-only from client.
create table news (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  source text,
  title text not null,
  description text,
  url text not null,
  image_url text,
  published_at timestamptz,
  created_at timestamptz default now(),
  unique(url)
);

create index idx_news_published_at on news(published_at desc nulls last);
create index idx_news_created_at on news(created_at desc);

alter table news enable row level security;
create policy "Public read" on news for select using (true);

-- News comments: same pattern as post comments. Writes via Edge Function only.
create table news_comments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references news(id) on delete cascade,
  parent_id uuid references news_comments(id) on delete cascade,
  content text not null,
  anon_fingerprint text,
  country_code text,
  created_at timestamptz default now()
);

create index idx_news_comments_news on news_comments(news_id);
create index idx_news_comments_parent on news_comments(parent_id);

alter table news_comments enable row level security;
create policy "Public read" on news_comments for select using (true);
