-- Rate limits (for edge functions: posts/hour, comments/hour, votes/hour)
create table rate_limits (
  id uuid primary key default gen_random_uuid(),
  anon_fingerprint text not null,
  action text not null,
  created_at timestamptz default now()
);

create index idx_rate_limits_lookup
  on rate_limits(anon_fingerprint, action, created_at desc);

alter table rate_limits enable row level security;
-- No anon read/write; only service role in edge functions
