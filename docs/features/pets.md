# Pets Feature

## Responsibilities

The pets feature owns pet listings, public discovery, owner dashboard management, filters, pagination, and pet image references.

## Domain Rules

- A pet listing has an owner.
- `age_months` is stored as a non-negative integer.
- `breed` depends on the species. Dogs, cats and rabbits pick it from `PET_BREEDS` (`constants.ts`) and the column stores the key; names live in `messages/*.json` under `pets.breeds`, and `breedLabel` (`breeds.ts`) shows them. Each list starts with a "no pedigree" option (`mixed`, or `domestic` for cats); an empty breed means "not sure". Other species keep a free-text breed of up to `PET_BREED_MAX_LENGTH` characters. `PetFormSchema` rejects a breed that is not in the list of the chosen species; the database does not check it.
- `listing_type` is one of the database enum values.
- Price must be non-negative and is relevant to sale listings.
- `reward` is the owner's reward for whoever finds a lost pet (CZK). The `pets_reward_only_for_lost` check allows it only on `lost` listings and only above zero. `createPet` / `updatePet` clear it when the listing type is not `lost`, so changing the type cannot violate the check. `PRICED_LISTING_TYPE` and `REWARD_LISTING_TYPE` in `constants.ts` decide which amount the form and the cards show; `formatCzk` (`src/shared/helpers/currencyFormat.ts`) formats both.
- `latitude` / `longitude` mark where the pet is, or where a lost pet was last seen or a found pet was found. Any listing type may have them; `pets_location_pair` requires both or neither, in valid ranges. `createPet` / `updatePet` round the point to `PET_LOCATION_DECIMALS` (3 decimals, about 100 m) so a pin on someone's home does not publish the exact address.

## Map Location

- The pet form (`components/dashboard/location/`) keeps city and address as text fields and adds a "Pick on the map" button that opens a modal with a Mapy.com map: click or drag the pin, or use the browser location. The modal edits a draft; Cancel keeps the previous point. Shelter pets have no location fields: they live at the shelter's address.
- Confirming a point makes one reverse geocoding request (`reverseGeocode` in `src/shared/lib/mapy.ts`) and fills the city and the street name. The house number is never filled in. Both fields stay editable, and the city keeps working for the catalog `city` filter. Picking points inside the modal makes no requests, to save the Mapy.com quota; address search is not offered for the same reason.
- The public pet page shows the point as a circle of `PET_LOCATION_PUBLIC_RADIUS_M` (300 m), not a pin.
- Maps load with `next/dynamic` and `ssr: false` because Leaflet needs `window`. Without `NEXT_PUBLIC_MAPY_API_KEY` the map button is hidden and the form works as before.

## Listing Status

| `status` | Public | Meaning |
| --- | --- | --- |
| `active` | yes | Published. |
| `reserved` | yes, with a "Reserved" badge | Someone is interested; the listing stays visible. |
| `hidden` | no (owner only) | Temporarily unpublished; no reason needed. |
| `closed` | no (owner only) | Finished; `close_reason` is required, `closed_at` is set by the database. |

Allowed `close_reason` per `listing_type` (enforced by a database check and mirrored in `CLOSE_REASONS_BY_LISTING_TYPE`):

- `lost`: `reunited`, `withdrawn`
- `found`: `reunited` (returned to its owner), `adopted`, `withdrawn`
- `adoption`: `adopted`, `withdrawn`
- `sale`: `sold`, `withdrawn`

Rules:

- Status changes go only through `changePetStatus`; the edit form never sends a status.
- The `pets_set_status_fields` trigger sets `closed_at` when a listing becomes `closed`, clears `close_reason` and `closed_at` when it leaves `closed`, and keeps `updated_at` current.
- Public queries (`getPublicPets`, `getPublicPet`) filter by `PUBLIC_PET_STATUSES` (`constants.ts`: `active`, `reserved`) explicitly. The owner's RLS policy is OR-ed with the public one, so without the filter a signed-in owner would see their own hidden and closed listings in public results.
- An attached shelter must belong to the current user before a pet is created or updated.

## Public Pages

| Route | What it shows |
| --- | --- |
| `/pets` | Catalog of public listings, 12 per page, newest first by default. |
| `/pets/[id]` | One listing: gallery, facts, health, description, contacts of the shelter or the author. |

- Catalog filters live in the URL (`q`, `species`, `listing_type`, `sex`, `age`, `breed`, `city`, `min_price`, `max_price`, `from_shelter`, `vaccinated`, `sterilized`, `sortBy`, `ascending`, `page`), so filtered views can be shared and indexed. The page parses them with `PetFiltersSchema`; malformed parameters fall back to the unfiltered catalog. Changing any filter resets `page`.
- Price filters are shown only for `sale` listings and are cleared when another listing type is chosen.
- Layout: filters in a left sidebar on desktop and in a left drawer on mobile; search and sorting sit above the results; active filters are shown as removable chips. "Clear all" keeps the sort order.
- `age` is an app-level bucket (`young` < 12 months, `adult` 12-95, `senior` 96+; `PET_AGE_GROUPS` and `PET_AGE_GROUP_MONTHS` in `constants.ts`), not a database enum. The `sex` filter offers only `male` and `female`.
- Flags (`from_shelter`, `vaccinated`, `sterilized`) are on only with the value `true`; `false` or anything else is ignored.
- `q` searches the name, the free-text breed, and the description, and also matches listed breeds by their name in any locale (`findBreedKeys`), because the column stores keys. `city` is a case-insensitive substring filter.
- `breed` is a comma-separated list of breed keys (`?breed=beagle,pug`), picked in a searchable multi-select that appears once a species with a breed list is chosen. Changing or clearing the species clears it. Characters that are PostgREST filter syntax or LIKE wildcards are replaced with spaces before building the pattern.
- `sortBy` is limited to `PET_SORT_FIELDS` (`constants.ts`); unknown columns are rejected.
- `getPublicPet` returns `null` for malformed ids and for missing, hidden, or closed listings; the page answers all of them with the same 404.
- A shelter pet shows the shelter's contacts in the page. A private listing shows a "Show contact" button (`PetOwnerContact`); on click `usePetOwnerContact` loads `/api/pets/[id]/contact`, so the contact is never in the HTML and is not indexed (`/api/` is disallowed in robots.txt). It is the author's live account contact: name plus one channel, the profile phone or, without a phone, the sign-in email. Owner profiles stay private under RLS; `getPetOwnerContact` calls the `get_pet_owner_contact` database function, which returns the contact only for public listings without a shelter and picks the channel itself, so a direct call cannot reveal the email either. Both cases render `PetContact`.
- The page ends with a "Report inappropriate content" link (`ReportLink`, see "Reports and takedowns" in `docs/decisions.md`).

## Access Patterns

- Server-rendered pages call feature queries directly.
- Client-side public search uses the feature hook and the public API route.
- Forms use server actions.
- Every mutation validates external input and relies on server-side authorization plus RLS.

## Decisions

Record pet-specific choices here (date, decision, why). Project-wide choices go to `docs/decisions.md`.
