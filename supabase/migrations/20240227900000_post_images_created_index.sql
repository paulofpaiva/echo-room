-- Index for efficient "latest images" query (order by created_at desc)
create index if not exists idx_post_images_created on post_images(created_at desc);
