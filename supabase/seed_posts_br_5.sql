-- Seed 5 posts BR + comentários
-- Comunidades: geral-pt-br, tech-pt-br, politica-pt-br

-- 5 posts
insert into posts (title, content, community_id, anon_fingerprint, country_code)
select
  v.title,
  v.content,
  co.id,
  md5(co.slug || '-br-' || v.n::text),
  'BR'
from (
  values
    (1, 'geral-pt-br', 'Preciso de um conselho sobre carreira', 'Estou em um momento de transição profissional e não sei se devo mudar de área ou continuar onde estou. Alguém já passou por isso?'),
    (2, 'geral-pt-br', 'Sou babaca por não querer ir no aniversário do cunhado?', 'Ele sempre foi rude comigo e minha família. Não quero fingir que está tudo bem. O que vocês acham?'),
    (3, 'tech-pt-br', 'Qual linguagem aprender em 2025?', 'Estou começando na programação e quero saber qual linguagem vale mais a pena investir tempo. Python, JavaScript ou outra?'),
    (4, 'geral-pt-br', 'Como superar a procrastinação?', 'Deixo tudo para a última hora e isso me prejudica muito. Quero mudar esse hábito.'),
    (5, 'politica-pt-br', 'Opinião sobre a reforma tributária', 'O que vocês acham das mudanças propostas? Será que vai simplificar de verdade?')
) as v(n, slug, title, content)
join communities co on co.slug = v.slug;

-- 2 comentários por post (10 comentários no total)
insert into comments (post_id, parent_id, content, anon_fingerprint, country_code)
select
  p.id,
  null,
  com.content,
  md5(p.id::text || '-c-' || com.n::text),
  'BR'
from posts p
cross join (
  values
    (1, 'Concordo com você, já passei por isso. O importante é não ter pressa.'),
    (2, 'Boa pergunta! Espero que você encontre a resposta que precisa.')
) as com(n, content)
where p.title in (
  'Preciso de um conselho sobre carreira',
  'Sou babaca por não querer ir no aniversário do cunhado?',
  'Qual linguagem aprender em 2025?',
  'Como superar a procrastinação?',
  'Opinião sobre a reforma tributária'
);
