-- Create pets storage bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('pets', 'pets', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "Authenticated users can upload pet images"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'pets'
    and (storage.foldername(name))[1] = 'pets-images'
);

-- Allow authenticated users to update their own files
create policy "Users can update their own pet images"
on storage.objects for update
to authenticated
using (bucket_id = 'pets');

-- Allow authenticated users to delete their own files
create policy "Users can delete their own pet images"
on storage.objects for delete
to authenticated
using (bucket_id = 'pets');

-- Allow public read access (bucket is public)
create policy "Public can view pet images"
on storage.objects for select
to public
using (bucket_id = 'pets');
