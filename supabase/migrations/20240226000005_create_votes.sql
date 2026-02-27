-- Votes (one per fingerprint per target; prevents double vote)
create table votes (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'comment')),
  target_id uuid not null,
  anon_fingerprint text not null,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamptz default now(),
  unique(target_id, anon_fingerprint)
);

create index idx_votes_target on votes(target_type, target_id);
create index idx_votes_fingerprint on votes(anon_fingerprint);

alter table votes enable row level security;
create policy "Public read" on votes for select using (true);
