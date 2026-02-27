-- Update duplicate seed posts: append community slug + row number for uniqueness
-- Handles both fresh posts and already-updated ones. Run in Supabase Dashboard → SQL Editor

with base_titles as (
  select id, community_id, created_at,
    case
      when title like 'Welcome to the community!%' then 'Welcome to the community!'
      when title like 'Quick question about the rules%' then 'Quick question about the rules'
      when title like 'Interesting topic I wanted to share%' then 'Interesting topic I wanted to share'
      when title like 'Weekly discussion thread%' then 'Weekly discussion thread'
      when title like 'Tips for newcomers%' then 'Tips for newcomers'
    end as base_title
  from posts
  where title like 'Welcome to the community!%'
     or title like 'Quick question about the rules%'
     or title like 'Interesting topic I wanted to share%'
     or title like 'Weekly discussion thread%'
     or title like 'Tips for newcomers%'
),
numbered as (
  select id, base_title, community_id,
    row_number() over (partition by community_id, base_title order by created_at) as rn
  from base_titles
)
update posts p
set title = n.base_title || ' · /c/' || c.slug ||
  case when n.rn > 1 then ' (' || n.rn || ')' else '' end
from numbered n
join communities c on c.id = n.community_id
where p.id = n.id;
