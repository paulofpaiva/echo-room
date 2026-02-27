-- Seed PT-BR communities: 2 posts and 2 comments (1 per post) each.
-- Run after seed.sql. Run before or after seed_posts/seed_comments (they skip these communities).

-- 2 posts per PT-BR community
insert into posts (title, content, community_id, anon_fingerprint)
select
  case c.slug
    when 'conselhos-de-vida' then 'Conselho de vida ' || s.n
    when 'sou-babaca' then 'Sou babaca por... ' || s.n
    when 'eu-odeio-meu-vizinho' then 'Problema com vizinho ' || s.n
  end,
  'Conteúdo do post em português. ' || coalesce(c.description, '') || ' Texto de exemplo para a comunidade.',
  c.id,
  md5(c.slug || '-ptbr-' || s.n::text)
from communities c
cross join generate_series(1, 2) as s(n)
where c.slug in ('conselhos-de-vida', 'sou-babaca', 'eu-odeio-meu-vizinho')
order by c.slug, s.n;

-- 2 comments per community (1 per post)
insert into comments (post_id, parent_id, content, anon_fingerprint)
select
  p.id,
  null,
  'Comentário em português neste post. Concordo ou tenho uma opinião.',
  md5(p.id::text || '-ptbr-c')
from posts p
join communities c on c.id = p.community_id
where c.slug in ('conselhos-de-vida', 'sou-babaca', 'eu-odeio-meu-vizinho')
order by c.slug, p.created_at, p.id;
