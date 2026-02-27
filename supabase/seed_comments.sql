-- Seed 10 comments per post (run after seed_posts.sql; only for original 5 communities' posts)
-- PT-BR communities get 2 comments from seed_ptbr.sql
-- Root-level comments only (parent_id null). anon_fingerprint: fake hash for UI badge.
insert into comments (post_id, parent_id, content, anon_fingerprint)
select
  p.id,
  null,
  'Comment ' || c.n || ' on this post. Lorem ipsum dolor sit amet.',
  md5(p.id::text || '-c-' || c.n::text)
from posts p
join communities co on co.id = p.community_id
cross join generate_series(1, 10) as c(n)
where co.slug in ('general', 'technology', 'gaming', 'creative', 'random')
order by p.created_at, p.id, c.n;
