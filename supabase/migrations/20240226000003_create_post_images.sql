-- Post images (up to 3 per post, ordered)
create table post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  storage_path text not null,
  display_order smallint not null check (display_order between 1 and 3),
  created_at timestamptz default now(),
  unique(post_id, display_order)
);

create index idx_post_images_post on post_images(post_id);

alter table post_images enable row level security;
create policy "Public read" on post_images for select using (true);
