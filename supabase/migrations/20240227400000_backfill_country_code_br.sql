-- Backfill: set Brazil for all existing posts and comments without country_code.

update posts
set country_code = 'BR'
where country_code is null;

update comments
set country_code = 'BR'
where country_code is null;
