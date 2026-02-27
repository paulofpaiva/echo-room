-- Reports: anonymous users can report posts or comments for moderation
-- target_type: 'post' | 'comment' | 'news_comment'
-- Writes via Edge Function only; no anon read/write

create table reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'comment', 'news_comment')),
  target_id uuid not null,
  anon_fingerprint text,
  reason text not null,
  created_at timestamptz default now()
);

create index idx_reports_target on reports(target_type, target_id);
create index idx_reports_created on reports(created_at desc);

alter table reports enable row level security;
-- No anon policies; only service role in edge functions
