-- Latest posts: use client query (order by created_at desc limit N).
-- Most commented: RPC returns (post_id, comment_count) ordered by count desc for home.

create or replace function get_most_commented_post_ids(p_limit int default 10)
returns table(post_id uuid, comment_count bigint)
language sql
stable
as $$
  select p.id as post_id, count(c.id)::bigint as comment_count
  from posts p
  left join comments c on c.post_id = p.id
  group by p.id
  order by comment_count desc, p.created_at desc
  limit greatest(p_limit, 1);
$$;
