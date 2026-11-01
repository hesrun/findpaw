-- New listing states:
--   reserved: someone is interested; still public, shown with a badge.
--   hidden:   temporarily unpublished by the owner; no reason required.
alter type public.pet_status add value if not exists 'reserved';
alter type public.pet_status add value if not exists 'hidden';

-- Why a listing was closed.
--   reunited:  a lost pet went home / a found pet was returned to its owner
--   adopted:   the pet found a new home
--   sold:      a sale listing was completed
--   withdrawn: closed without a result
create type public.pet_close_reason as enum ('reunited', 'adopted', 'sold', 'withdrawn');
