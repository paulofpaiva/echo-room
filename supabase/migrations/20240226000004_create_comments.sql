-- Comments (nested via parent_id)
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  anon_fingerprint text,
  upvotes integer default 0,
  downvotes integer default 0,
  created_at timestamptz default now()
);

create index idx_comments_post on comments(post_id);
create index idx_comments_parent on comments(parent_id);

alter table comments enable row level security;
create policy "Public read" on comments for select using (true);
