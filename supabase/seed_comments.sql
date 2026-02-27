-- Seed 10 comments per post (run after seed_posts.sql; requires posts to exist)
-- Root-level comments only (parent_id null). anon_fingerprint: fake hash for UI badge.
insert into comments (post_id, parent_id, content, anon_fingerprint)
select
  p.id,
  null,
  'Comment ' || c.n || ' on this post. Lorem ipsum dolor sit amet.',
  md5(p.id::text || '-c-' || c.n::text)
from posts p
cross join generate_series(1, 10) as c(n)
order by p.created_at, p.id, c.n;
