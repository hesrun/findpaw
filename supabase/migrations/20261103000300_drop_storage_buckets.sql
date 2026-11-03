-- Images live in Cloudinary (see docs/decisions.md); the Supabase Storage
-- buckets are unused. Their policies also let any signed-in user update or
-- delete any file in the bucket. Supabase blocks deleting storage rows from
-- SQL, so the buckets themselves are emptied and removed through the
-- Storage API; this migration removes the policies.
drop policy if exists "Authenticated users can upload pet images" on storage.objects;
drop policy if exists "Users can update their own pet images" on storage.objects;
drop policy if exists "Users can delete their own pet images" on storage.objects;
drop policy if exists "Public can view pet images" on storage.objects;

drop policy if exists "Authenticated users can upload shelter images" on storage.objects;
drop policy if exists "Users can update their own shelter images" on storage.objects;
drop policy if exists "Users can delete their own shelter images" on storage.objects;
drop policy if exists "Public can view shelter images" on storage.objects;
