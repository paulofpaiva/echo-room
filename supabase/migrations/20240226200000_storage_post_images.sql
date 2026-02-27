-- Policies for bucket "post-images". Create the bucket in Dashboard (Storage)
-- with name "post-images", public, ~5MB limit, MIME image/* if it does not exist.

-- Allow anon to upload and public to read post-images
drop policy if exists "Allow anon upload post images" on storage.objects;
create policy "Allow anon upload post images"
on storage.objects for insert to anon
with check (bucket_id = 'post-images');

drop policy if exists "Allow public read post images" on storage.objects;
create policy "Allow public read post images"
on storage.objects for select to anon
using (bucket_id = 'post-images');
