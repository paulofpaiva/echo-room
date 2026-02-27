-- Run this in Supabase Dashboard → SQL Editor if you only want to add the 3 PT-BR communities.
-- Safe to run multiple times (skips if slug already exists).
insert into communities (name, slug, description) values
  ('Conselhos de vida', 'conselhos-de-vida', 'Conselhos e reflexões sobre a vida'),
  ('Sou babaca?', 'sou-babaca', 'Conta sua situação e descubra se você é o babaca'),
  ('Eu odeio meu vizinho', 'eu-odeio-meu-vizinho', 'Desabafos sobre vizinhos e convivência')
on conflict (slug) do nothing;
