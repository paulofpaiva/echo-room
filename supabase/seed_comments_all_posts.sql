-- Seed 3 comments per post for all posts (run after seed_posts_all_communities.sql)
-- Root-level comments only (parent_id null)

insert into comments (post_id, parent_id, content, anon_fingerprint, country_code)
select
  p.id,
  null,
  c.content,
  md5(p.id::text || '-c-' || c.n::text),
  case when random() > 0.5 then 'BR' else 'US' end
from posts p
cross join (
  values
    (1, 'Great post! Thanks for sharing.'),
    (2, 'I agree with this. Looking forward to more discussions.'),
    (3, 'Interesting perspective. What do others think?')
) as c(n, content);
