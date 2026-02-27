-- Search communities by name or slug (ilike).
-- Returns explicit table so Supabase PostgREST exposes the RPC correctly.

create or replace function search_communities(p_query text)
returns table(
  id uuid,
  name text,
  slug text,
  description text,
  created_at timestamptz
)
language sql
stable
as $$
  select c.id, c.name, c.slug, c.description, c.created_at
  from communities c
  where
    trim(coalesce(p_query, '')) = ''
    or c.name ilike '%' || trim(p_query) || '%'
    or c.slug ilike '%' || trim(p_query) || '%'
  order by c.name
  limit 50;
$$;
