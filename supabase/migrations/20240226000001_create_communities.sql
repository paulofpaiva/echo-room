-- Communities (read-only from app; seeded)
create table communities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz default now()
);

alter table communities enable row level security;
create policy "Public read" on communities for select using (true);
