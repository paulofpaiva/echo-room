-- Posts
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  community_id uuid not null references communities(id),
  anon_fingerprint text,
  upvotes integer default 0,
  downvotes integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_posts_community on posts(community_id);
create index idx_posts_created on posts(created_at desc);

alter table posts enable row level security;
create policy "Public read" on posts for select using (true);
