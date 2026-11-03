-- Every listing type may carry a map point now: the pet form picks the
-- location on a map for all of them. The pair and range check
-- (pets_location_pair) stays.
alter table public.pets
  drop constraint pets_location_only_for_lost_found;
