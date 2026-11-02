-- Reward the owner of a lost pet offers to whoever finds it (CZK).
-- Same precision as price. Existing RLS policies on pets already cover the
-- new column: owners write it, everyone reads it on public listings.
alter table public.pets
  add column reward numeric(10,2);

-- Only lost listings carry a reward, and a reward is always positive.
-- Changing the listing type away from 'lost' requires clearing the reward
-- in the same update (the server action does this).
alter table public.pets
  add constraint pets_reward_only_for_lost
  check (reward is null or (listing_type = 'lost' and reward > 0));
