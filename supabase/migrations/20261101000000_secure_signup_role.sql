-- 'clinic' was added to the remote enum manually; keep migrations in sync.
alter type public.user_role add value if not exists 'clinic';

-- Sign-up metadata is user-controlled: accept only self-service roles.
-- 'admin' is never taken from metadata; it is assigned only via service role / SQL.
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    case
      when requested_role in ('user', 'shelter', 'clinic')
        then requested_role::public.user_role
      else 'user'::public.user_role
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Profiles are created only by the trigger above. Users may edit their own
-- profile fields, but never `role` or `id`; RLS policies cannot restrict
-- columns, so column privileges do it.
drop policy if exists "Users can insert their own profile" on public.profiles;

revoke insert, update on public.profiles from anon, authenticated;
grant update (full_name, avatar_url, phone, city) on public.profiles to authenticated;
