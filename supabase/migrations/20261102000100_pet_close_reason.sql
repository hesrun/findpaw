alter table public.pets
  add column close_reason public.pet_close_reason,
  add column closed_at timestamptz;

-- A closed listing always has a reason; other statuses never do.
alter table public.pets
  add constraint pets_close_reason_matches_status
  check ((status = 'closed') = (close_reason is not null));

-- The reason must make sense for the listing type.
alter table public.pets
  add constraint pets_close_reason_matches_listing_type
  check (
    close_reason is null
    or (listing_type = 'lost' and close_reason in ('reunited', 'withdrawn'))
    or (listing_type = 'found' and close_reason in ('reunited', 'adopted', 'withdrawn'))
    or (listing_type = 'adoption' and close_reason in ('adopted', 'withdrawn'))
    or (listing_type = 'sale' and close_reason in ('sold', 'withdrawn'))
  );

-- closed_at and updated_at are set by the database, never by the client.
-- Leaving 'closed' clears the reason and date, so reopening needs no extra fields.
create or replace function public.pets_set_status_fields()
returns trigger
set search_path = ''
as $$
begin
  if new.status <> 'closed' then
    new.close_reason := null;
    new.closed_at := null;
  elsif tg_op = 'INSERT' or old.status <> 'closed' then
    new.closed_at := now();
  end if;

  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger pets_set_status_fields
  before insert or update on public.pets
  for each row execute function public.pets_set_status_fields();

-- Trigger-only function: not callable through the API.
revoke execute on function public.pets_set_status_fields() from public, anon, authenticated;

-- Reserved listings stay public. Compared as text because the new enum values
-- may not be committed yet when this migration runs.
drop policy "Public can view active pets" on public.pets;

create policy "Public can view active and reserved pets"
on public.pets for select
to public
using (status::text in ('active', 'reserved'));
