-- A private listing reveals one contact channel of its author: the profile
-- phone, or the sign-in email only when there is no phone. The rule lives here
-- so that calling the function directly cannot reveal the email either.
create or replace function public.get_pet_owner_contact(pet_id uuid)
returns table (full_name text, phone text, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.full_name,
    nullif(trim(p.phone), ''),
    case when nullif(trim(p.phone), '') is null then u.email::text end
  from public.pets pet
  join public.profiles p on p.id = pet.owner_id
  join auth.users u on u.id = pet.owner_id
  where pet.id = get_pet_owner_contact.pet_id
    and pet.shelter_id is null
    and pet.status in ('active', 'reserved');
$$;
