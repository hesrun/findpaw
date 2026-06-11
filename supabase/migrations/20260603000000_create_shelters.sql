create table shelters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  phone text,
  email text,
  website text,
  city text,
  address text,
  img_url text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table shelters enable row level security;

create policy "Public can view shelters"
on shelters for select to public using (true);

create policy "Owner can insert shelters"
on shelters for insert to authenticated
with check (auth.uid() = owner_id);

create policy "Owner can update shelters"
on shelters for update to authenticated
using (auth.uid() = owner_id);

create policy "Owner can delete shelters"
on shelters for delete to authenticated
using (auth.uid() = owner_id);

alter table pets
  add column shelter_id uuid references shelters(id) on delete set null;

insert into storage.buckets (id, name, public)
values ('shelters', 'shelters', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload shelter images"
on storage.objects for insert to authenticated
with check (bucket_id = 'shelters' and (storage.foldername(name))[1] = 'shelter-images');

create policy "Users can update their own shelter images"
on storage.objects for update to authenticated
using (bucket_id = 'shelters');

create policy "Users can delete their own shelter images"
on storage.objects for delete to authenticated
using (bucket_id = 'shelters');

create policy "Public can view shelter images"
on storage.objects for select to public
using (bucket_id = 'shelters');
