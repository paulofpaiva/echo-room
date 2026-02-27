-- Seed posts for all communities (run after seed.sql)
-- Generates 5 posts per community with varied content (titles include community name to avoid duplicates)

insert into posts (title, content, community_id, anon_fingerprint, country_code)
select
  p.title || ' · ' || c.name,
  p.content,
  c.id,
  md5(c.slug || '-' || p.n::text),
  case when random() > 0.5 then 'BR' else 'US' end
from communities c
cross join (
  values
    (1, 'Welcome to the community!', 'Hello everyone! This is my first post here. Looking forward to **great discussions** and meeting new people.'),
    (2, 'Quick question about the rules', 'I read the guidelines but still have a doubt. Can someone clarify if we can share external links here? Thanks!'),
    (3, 'Interesting topic I wanted to share', 'I found this article and thought it might be relevant: [check it out](https://example.com). What do you think?'),
    (4, 'Weekly discussion thread', 'Let''s talk about what we''ve been up to this week. Drop a comment below!'),
    (5, 'Tips for newcomers', 'Here are some tips that helped me:

- Read the rules first
- Be respectful
- Use **markdown** for formatting

Hope this helps!')
) as p(n, title, content);
