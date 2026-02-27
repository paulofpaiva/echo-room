-- Reply count per comment for a post (for display on comment cards)
create or replace function get_reply_counts(p_post_id uuid)
returns table(comment_id uuid, reply_count bigint)
language sql
stable
as $$
  select parent_id as comment_id, count(*)::bigint as reply_count
  from comments
  where post_id = p_post_id and parent_id is not null
  group by parent_id;
$$;

-- Comment count per post (for display on post cards in feed)
create or replace function get_comment_counts(p_post_ids uuid[])
returns table(post_id uuid, comment_count bigint)
language sql
stable
as $$
  select post_id, count(*)::bigint as comment_count
  from comments
  where post_id = any(p_post_ids)
  group by post_id;
$$;

-- Post count per community (for display on home community cards)
create or replace function get_community_post_counts()
returns table(community_id uuid, post_count bigint)
language sql
stable
as $$
  select community_id, count(*)::bigint as post_count
  from posts
  group by community_id;
$$;
