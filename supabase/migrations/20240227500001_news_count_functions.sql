-- Reply count per news comment (for "N replies" on comment cards)
create or replace function get_news_reply_counts(p_news_id uuid)
returns table(comment_id uuid, reply_count bigint)
language sql
stable
as $$
  select parent_id as comment_id, count(*)::bigint as reply_count
  from news_comments
  where news_id = p_news_id and parent_id is not null
  group by parent_id;
$$;

-- Comment count per news item (for list/detail)
create or replace function get_news_comment_counts(p_news_ids uuid[])
returns table(news_id uuid, comment_count bigint)
language sql
stable
as $$
  select news_id, count(*)::bigint as comment_count
  from news_comments
  where news_id = any(p_news_ids)
  group by news_id;
$$;
