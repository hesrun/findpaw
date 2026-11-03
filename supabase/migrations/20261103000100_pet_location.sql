-- Map point where a lost pet was last seen or a found pet was found.
-- Existing RLS policies on pets already cover the new columns: owners write
-- them, everyone reads them on public listings. The server action rounds the
-- coordinates before saving, so a point placed on someone's home does not
-- publish the exact address.
alter table public.pets
  add column latitude double precision,
  add column longitude double precision;

-- Both coordinates or neither, inside valid ranges.
alter table public.pets
  add constraint pets_location_pair
  check (
    (latitude is null and longitude is null)
    or (
      latitude is not null and longitude is not null
      and latitude between -90 and 90
      and longitude between -180 and 180
    )
  );

-- Only lost and found listings carry a map point. Changing the listing type
-- to another one requires clearing the point in the same update (the server
-- action does this).
alter table public.pets
  add constraint pets_location_only_for_lost_found
  check (latitude is null or listing_type in ('lost', 'found'));
