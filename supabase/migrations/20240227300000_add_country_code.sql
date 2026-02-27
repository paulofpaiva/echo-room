-- Store country (ISO 3166-1 alpha-2) for post/comment author location; optional, sent by client.

alter table posts
  add column if not exists country_code text;

alter table comments
  add column if not exists country_code text;
