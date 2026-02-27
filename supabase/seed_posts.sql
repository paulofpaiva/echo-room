-- Seed 20 posts per community (run after seed.sql; only for original 5 communities)
-- PT-BR communities get 2 posts each from seed_ptbr.sql
-- anon_fingerprint: fake hash per (community, n) so each "author" has a stable color in the UI
insert into posts (title, content, community_id, anon_fingerprint)
select
  'Post ' || s.n || ' in ' || c.name,
  'This is the content for post ' || s.n || ' in ' || c.name || '. ' || coalesce(c.description, '') || ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  c.id,
  md5(c.slug || '-' || s.n::text)
from communities c
cross join generate_series(1, 20) as s(n)
where c.slug in ('general', 'technology', 'gaming', 'creative', 'random')
order by c.slug, s.n;
