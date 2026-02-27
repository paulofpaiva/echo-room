-- Most commented: exclude posts with 0 comments (home + search).

create or replace function get_most_commented_post_ids(p_limit int default 10)
returns table(post_id uuid, comment_count bigint)
language sql
stable
as $$
  select p.id as post_id, count(c.id)::bigint as comment_count
  from posts p
  inner join comments c on c.post_id = p.id
  group by p.id
  having count(c.id) > 0
  order by comment_count desc, p.created_at desc
  limit greatest(p_limit, 1);
$$;

-- search_posts: most_commented order excludes posts with 0 comments
create or replace function search_posts(
  p_query text,
  p_order text,
  p_limit int default 10,
  p_offset int default 0
)
returns table(
  post_id uuid,
  title text,
  content_preview text,
  community_slug text,
  created_at timestamptz,
  comment_count bigint
)
language plpgsql
stable
as $$
begin
  p_query := coalesce(trim(p_query), '');
  if p_query = '' then
    return query
    select
      p.id,
      p.title,
      left(p.content, 200)::text,
      c.slug,
      p.created_at,
      count(cm.id)::bigint
    from posts p
    join communities c on c.id = p.community_id
    left join comments cm on cm.post_id = p.id
    group by p.id, p.title, p.content, p.created_at, c.slug
    order by p.created_at desc
    limit greatest(p_limit, 1)
    offset greatest(p_offset, 0);
    return;
  end if;

  if p_order = 'oldest' then
    return query
    select
      p.id,
      p.title,
      left(p.content, 200)::text,
      c.slug,
      p.created_at,
      count(cm.id)::bigint
    from posts p
    join communities c on c.id = p.community_id
    left join comments cm on cm.post_id = p.id
    where p.title ilike '%' || p_query || '%' or p.content ilike '%' || p_query || '%'
    group by p.id, p.title, p.content, p.created_at, c.slug
    order by p.created_at asc
    limit greatest(p_limit, 1)
    offset greatest(p_offset, 0);
  elsif p_order = 'most_commented' then
    return query
    select
      p.id,
      p.title,
      left(p.content, 200)::text,
      c.slug,
      p.created_at,
      count(cm.id)::bigint as cnt
    from posts p
    join communities c on c.id = p.community_id
    left join comments cm on cm.post_id = p.id
    where p.title ilike '%' || p_query || '%' or p.content ilike '%' || p_query || '%'
    group by p.id, p.title, p.content, p.created_at, c.slug
    having count(cm.id) > 0
    order by cnt desc, p.created_at desc
    limit greatest(p_limit, 1)
    offset greatest(p_offset, 0);
  else
    return query
    select
      p.id,
      p.title,
      left(p.content, 200)::text,
      c.slug,
      p.created_at,
      count(cm.id)::bigint
    from posts p
    join communities c on c.id = p.community_id
    left join comments cm on cm.post_id = p.id
    where p.title ilike '%' || p_query || '%' or p.content ilike '%' || p_query || '%'
    group by p.id, p.title, p.content, p.created_at, c.slug
    order by p.created_at desc
    limit greatest(p_limit, 1)
    offset greatest(p_offset, 0);
  end if;
end;
$$;
