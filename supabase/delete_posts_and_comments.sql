-- Delete all posts, comments, replies, and post images. Keeps communities.
-- Run in Supabase Dashboard → SQL Editor

-- Order matters: comments (incl. replies) → post_images → posts
delete from comments;
delete from post_images;
delete from posts;
