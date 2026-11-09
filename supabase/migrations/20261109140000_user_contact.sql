-- Contact of a private listing's author comes live from their account:
-- the profile phone and the sign-in email. Profiles stay owner-only under RLS;
-- this function exposes only the contact of authors of public listings.

-- Optional phone typed at sign-up. Metadata is user-controlled, so the value
-- is trimmed and capped here (30 = PROFILE_PHONE_MAX_LENGTH in the app).
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
begin
  insert into public.profiles (id, full_name, avatar_url, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    nullif(left(trim(new.raw_user_meta_data->>'phone'), 30), ''),
    case
      when requested_role in ('user', 'shelter', 'clinic')
        then requested_role::public.user_role
      else 'user'::public.user_role
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Returns a row only for a public listing ('active', 'reserved', the same as
-- PUBLIC_PET_STATUSES) that does not belong to a shelter; shelter listings show
-- the shelter's own contact.
create or replace function public.get_pet_owner_contact(pet_id uuid)
returns table (full_name text, phone text, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.full_name, p.phone, u.email::text
  from public.pets pet
  join public.profiles p on p.id = pet.owner_id
  join auth.users u on u.id = pet.owner_id
  where pet.id = get_pet_owner_contact.pet_id
    and pet.shelter_id is null
    and pet.status in ('active', 'reserved');
$$;

revoke execute on function public.get_pet_owner_contact(uuid) from public;
grant execute on function public.get_pet_owner_contact(uuid) to anon, authenticated;
