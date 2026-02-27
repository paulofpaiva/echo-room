-- Seed 20 posts per community (run after seed.sql; requires communities to exist)
insert into posts (title, content, community_id)
select
  'Post ' || s.n || ' in ' || c.name,
  'This is the content for post ' || s.n || ' in ' || c.name || '. ' || coalesce(c.description, '') || ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  c.id
from communities c
cross join generate_series(1, 20) as s(n)
order by c.slug, s.n;
