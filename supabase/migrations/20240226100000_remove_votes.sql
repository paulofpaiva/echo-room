-- Remove voting: drop votes table and vote columns from posts and comments

drop table if exists votes;

alter table posts
  drop column if exists upvotes,
  drop column if exists downvotes;

alter table comments
  drop column if exists upvotes,
  drop column if exists downvotes;
