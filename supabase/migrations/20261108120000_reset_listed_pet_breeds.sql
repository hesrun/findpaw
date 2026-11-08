-- Dog, cat and rabbit breeds are now picked from a fixed list, and pets.breed
-- stores the list key (PET_BREEDS in src/features/pets/constants.ts). The old
-- free-text values of these species cannot be mapped to keys reliably, so they
-- are cleared. Other species keep their free-text breed.
update public.pets
set breed = null
where species in ('dog', 'cat', 'rabbit')
  and breed is not null;
