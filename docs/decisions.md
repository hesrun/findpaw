# Decisions

A short log of choices that are not obvious from the code. Add an entry when a choice is made or changed. Keep entries brief: what was decided and why. Mark undecided questions as **Open**.

## Server-first public listings with `initialData`

Public landing sections load their first records in a Server Component and pass them to a Client Component as TanStack Query `initialData`. The first response contains the content for SEO and fast display; the client owns only refetching and interactive state.

## Server actions for mutations, API routes for client reads

Browser mutations go through server actions. Internal GET API routes exist only for client-side fetching that needs React Query cache, pagination, or refetching. Server Components call feature queries directly and never call internal API routes.

## Public pet catalog: server-rendered from the URL, no TanStack Query

`/pets` reads its filters from `searchParams` and calls `getPublicPets` in a Server Component. The filter form only rewrites the query string. Unlike the landing sections, every filter combination is a separate URL that must render with content for sharing and SEO, so a client cache would duplicate state that the URL already holds. The `/api/pets` route and `usePublicPets` remain for the landing section.

## Catalog filter UI: one URL hook and one context, no Zustand

The catalog filter UI is split into small components (`src/features/pets/components/public/catalog/`). Filters, search, and sort all write the same query string, so one hook (`useCatalogUrl`) owns every URL write: separate writers would drop text that is typed but not yet debounced when another control navigates first. One context at the widget root shares that hook instance. A Zustand store was rejected: the URL is already the single source of filter state, and a store would be a second copy to keep in sync with back/forward navigation and server rendering. Zustand can still be considered for truly global client state (for example favorites) with its own entry here.

## Next.js 16 `proxy.ts`

Locale routing and early auth/role redirects live in `src/proxy.ts` (the Next.js 16 replacement for `middleware.ts`). Redirects there are UX only; RLS and server-side checks remain the security boundary.

## Self-selected roles at sign-up, `admin` never

Users pick `user`, `shelter`, or `clinic` at sign-up. The choice travels in user metadata, so the `handle_new_user` trigger accepts it only from that allow-list and falls back to `user`; `admin` is assigned only through the service role or SQL. After sign-up `profiles.role` is the source of truth. RLS policies cannot restrict columns, so `authenticated` has column-level `update` grants only on editable profile fields and no `insert` on `profiles`: the trigger is the only writer of `role`.

`clinic` is hidden from the sign-up form for now (`SIGN_UP_EXCLUDED_ROLES` in `src/features/auth/constants.ts`); `signUp` maps it to `user`. The database trigger still accepts `clinic`, so a direct Supabase sign-up call can create a clinic account. This is acceptable while clinics have no extra rights; remove `clinic` from the trigger allow-list with a migration before they get any.

## Current user via per-request `cache()`, no client provider

`getCurrentUser` (`src/shared/lib/supabase/auth.ts`) and `getProfile` (`src/shared/lib/supabase/profile.ts`) are wrapped in React `cache()`, so every Server Component in one render shares a single `auth.getUser()` call and a single `profiles` query. The cache lives for one request only, so it never serves stale or another user's data. Server components call these helpers instead of querying Supabase themselves. A client-side user provider is not used yet because almost no client components need the user; when they do, the layout should pass `getProfile()` output into it rather than use the browser Supabase client.

## Pet status and close reason are separate fields

`pets.status` (`active`, `reserved`, `hidden`, `closed`) says what the listing is doing now and drives public visibility; `close_reason` says how a closed listing ended. One long status enum (`adopted`, `sold`, ...) would make the public policy and the UI harder and allow nonsense combinations; with two fields a single check ties the reason to the listing type. `closed_at` is set by a trigger so the date cannot be faked from the client and is ready for "found a home in N days" statistics. `hidden` deliberately has no reason: it is a pause, not an outcome. Moderation (`pending`) is not modelled yet.

## Visual language: Soft Playful

Chosen from four concepts (2026-11). White page; lavender (`--hero`, `--soft`) only for the hero, form fields and pills. Baloo 2 (`font-display`) for page and card titles, Nunito for text and UI (`font-heading` stays Nunito because buttons and chips use it). The accent stays the HeroUI token `oklch(50% 0.22 291)`; primary and outline buttons cast a soft shadow in the accent hue (`.button--*` overrides in `styles.css`). Cards use `rounded-card` (28px) with media inset at `rounded-media` (22px). Chips are sentence case with a colored dot, not all-caps fills. Listings without a photo show flat, low-contrast species faces from `PetPlaceholder` instead of a generic icon. The dark theme block in `styles.css` is not wired to anything and was not redesigned.

## Open: styling approach

HeroUI v3 is built on Tailwind CSS v4 (`@heroui/styles` has `tailwindcss` as a peer dependency), so Tailwind cannot be removed while HeroUI components are in use. The preferred direction is SCSS modules on the existing CSS custom-property tokens in `src/css/styles.css`, possibly replacing HeroUI with React Aria Components over time. Not yet decided.

## Images: Cloudinary with signed browser uploads

Images go from the browser straight to Cloudinary, so files never pass through our server or its request size limit. The upload is signed: `signImageUpload` (`src/shared/lib/cloudinary/actions.ts`) checks the session and signs the folder (`<pets|shelters|avatars>/<user id>`), the timestamp, the allowed formats, and the folder's incoming transformation (`IMAGE_UPLOAD_TRANSFORMATIONS`; avatars are cropped to a square on upload, so the original is never stored) with `CLOUDINARY_API_SECRET`; Cloudinary rejects any changed parameter. The old unsigned preset let anyone upload to the account with values from the client bundle. The signature is a SHA-1 over the sorted parameters, done with `node:crypto` instead of the Cloudinary SDK. Saved URLs are validated by `imageUrls(max)` in `src/shared/lib/form.ts`: only our cloud, at most the feature's photo limit. Images are shown with `CloudImage` (a client wrapper over next-cloudinary's `CldImage`), so Cloudinary picks size, format, and quality instead of the Next.js image optimizer. The uploader is our own UI on React Aria `DropZone` and `FileTrigger` (already a HeroUI dependency); the Cloudinary upload widget was rejected for its look. Files stay in the browser until the form is saved.

Saving a form or deleting a pet or shelter deletes the photos it no longer uses (`deleteUserImages` in `src/shared/lib/cloudinary/server.ts`, run with `after()` so the response does not wait). Only files inside the user's own folder are deleted: any URL from our cloud may be saved on a listing, so a URL alone does not prove ownership. Older images uploaded before user folders are never deleted. Supabase Storage is not used; its buckets and policies were removed (`20261103000300_drop_storage_buckets.sql`).

## Password recovery and sign-up confirmation through `token_hash` and `/api/auth/confirm`

The reset and sign-up confirmation emails link to `/api/auth/confirm`, which calls `verifyOtp` with the `token_hash` and then redirects by link type (`AUTH_CONFIRM_REDIRECTS`): `recovery` to `/<locale>/reset-password`, `email` to the dashboard. The PKCE `code` flow was rejected because it only works in the browser that requested the reset, and users often open the email on another device. This needs a custom "Reset Password" email template (see `docs/development.md`). The handler sits under `/api` so the next-intl proxy does not add a locale prefix; the locale travels as a query parameter validated against `routing.locales`, and the redirect target is built on the server, so the link cannot redirect off the site. `requestPasswordReset` always reports success so the form does not reveal which emails have accounts. `/reset-password` is not an auth path in `src/proxy.ts`: the recovery link signs the user in, so the page requires a session and sends visitors without one back to `/forgot-password?error=linkExpired`.

Auth emails are English-only for the MVP. Supabase has one template per email type, and per-locale emails would need either locale conditions on `user_metadata` or a Send Email Hook; the hook (React Email with `messages/*.json`) is the planned path once localized emails matter.

## Pet map location: Leaflet with Mapy.com in a modal, rounded point

Every listing type may have a map point, picked in a modal next to the plain city and address fields (an inline map in the narrow location card was too cramped). The text address of a listing was already public, so a rounded point adds little exposure; it also enables a later "near me" search. Reverse geocoding fills the street but never the house number, and runs once per confirmed point, not per click; address search in the modal was left out to stay within the free Mapy.com quota. The server rounds the point to about 100 m and the public page shows a 300 m circle, because people often put the pin on their own house. Tiles and reverse geocoding come from Mapy.com (Seznam): the project is Czech, the maps are the best for the Czech Republic and have cs/en labels, and the free tier is enough. OpenStreetMap with Nominatim was rejected because the public Nominatim allows about one request per second and asks heavy users to run their own server. Leaflet + react-leaflet render the map; the Mapy.com terms require their logo and attribution on every map (`BaseMap`). The API key is public (`NEXT_PUBLIC_MAPY_API_KEY`) because the browser requests tiles; restrict it by HTTP referrer in the Mapy.com console.

## Legal pages under Czech law, kept in sync with features

`/privacy` (GDPR Art. 13, cookies in its `#cookies` section) and `/terms` (Civil Code, Act No. 480/2004 Coll. hosting liability, DSA contact point and notice-and-action) are linked from the footer and the sign-up form. The legal basis for accounts and listings is the contract, not consent, so sign-up shows a notice with links instead of a checkbox. Only strictly necessary cookies are used (Supabase auth, `NEXT_LOCALE`), so there is no cookie banner (§ 89(3) of Act No. 127/2005 Coll.). Account deletion is handled by email request within 30 days until a self-service button exists.

The documents describe what the code does. Any feature that adds personal data fields, a new third-party service, analytics or other non-essential cookies, payments, messaging between users, new public data, or moderation must update `messages/legal/*.json` and `LEGAL_EFFECTIVE_DATE` in the same change, after the change is agreed with the project owner. These texts are a draft written without a lawyer.

The website is hosted on Vercel; the Supabase project is in West EU (Ireland). Both are listed as recipients in the privacy policy, so moving either one means updating `messages/legal/*.json`.

## Email: Brevo SMTP for auth, Cloudflare DNS and Email Routing

The built-in Supabase email service sends only a few emails per hour, which is not enough for real sign-ups, so Supabase Auth sends through Brevo SMTP (free tier) from `noreply@findpaw.cz`. Automatic emails use a separate no-reply sender so that replies never land in a place nobody reads by mistake; people who need to write to us use `info@findpaw.cz`. That address is forwarded by Cloudflare Email Routing instead of being a hosted mailbox: it is free and enough for the MVP. The domain's DNS moved to Cloudflare for this, and it also holds the Brevo SPF/DKIM/DMARC records. Brevo and Cloudflare are listed as recipients in the privacy policy. Setup details are in `docs/development.md`.

## Password change checks the current password by signing in

Supabase `updateUser({ password })` accepts a new password from any valid session, so a stolen or forgotten-open session could lock the owner out. `changePassword` first calls `signInWithPassword` with the current password and rejects the change if it fails. Supabase's "Secure password change" setting (reauthentication nonce by email) was not used: it adds an email round-trip, and auth emails are English-only for now.

## Unit tests first: Vitest in Node, pure logic only

Testing started with Vitest unit tests for schemas, form helpers, and other pure functions: they guard the validation boundary, run in under a second, and need no services. The environment is `node`, not `jsdom`, because no component tests exist; React Testing Library and jsdom can be added when a component needs one. Aliases come from `tsconfig.json` through Vite's built-in `resolve.tsconfigPaths`, so there is no `vite-tsconfig-paths` plugin. `@types/node` follows the Node 22 runtime, as Vitest requires. Tests for RLS policies (needs the local Supabase stack) and end-to-end flows (Playwright) are postponed.

## Pet breeds: fixed lists in code, keys in the text column

Free-text breeds could not be filtered or translated ("Labrador", "labrador", "Лабрадор"). Dogs, cats and rabbits now pick a breed from `PET_BREEDS`; `pets.breed` stays a text column and stores the key, with names in the message files. A Postgres enum was rejected because every new breed would need a migration and other species keep free text in the same column; a `breeds` table was rejected as an extra layer for under a hundred static entries. Validation is in `PetFormSchema` only. There is no "other" option: a breed missing from the list is "no pedigree" or left empty, otherwise free text would come back. Old dog, cat and rabbit breeds were cleared by a migration instead of being mapped. The catalog search matches listed breeds by name in every locale before querying, since the database holds keys.

## Listing contact comes live from the author's account

A private listing's contact is the author's account contact, read live through the `get_pet_owner_contact` security definer function. Copying a contact onto each listing was tried and dropped: the user would have to update every listing after changing their phone or email. The trade-off is that one listing cannot have its own contact.

Lost and found listings need a contact without registration, since a finder will not sign up first. To limit harvesting, the contact is not in the page HTML: a "Show contact" button loads it from `/api/pets/[id]/contact`, which crawlers do not index. Only one channel is revealed: the phone, or the sign-in email when there is no phone. The sign-in email is the account identifier, so showing it invites phishing and password guessing; the function picks the channel, so a direct RPC call cannot get the email of a user with a phone. A relay contact form (messages sent through our email provider) was rejected for the MVP. The endpoint has no rate limit yet: a determined bot can still call it per listing. Cloudflare Turnstile (planned for sign-up) is the next step if harvesting appears.

A new shelter is prefilled with the same contact but keeps its own copy afterwards, because a shelter is an organization with its own phone and email.

## Reports and takedowns: email and manual moderation for the MVP

The terms promise a DSA notice-and-action process. Pet and shelter pages have a "Report inappropriate content" link (`ReportLink` in `src/shared/components/UI/`): a `mailto:` to `LEGAL_OPERATOR.email` with the page link in the subject and the points a report needs (reason, name, good-faith statement) in the body. A report form with its own table was rejected for the MVP: it needs storage, spam protection, and an admin screen, while the email already is the DSA contact point.

There is no admin screen yet. A takedown is done by hand in the Supabase Dashboard (Table Editor or SQL, which bypass RLS): delete the `pets` or `shelters` row. Setting a pet to `hidden` does not work as a takedown, because the owner can make it active again. Deleting a shelter keeps its pets (`shelter_id` is set to null), so delete or check them too. A manual delete does not run `deleteUserImages`, so remove the photos in the Cloudinary console. Then email the author the reason (DSA Art. 17) and reply to the reporter. An admin RLS policy and a moderation screen come later.

## Feature hooks live in one flat `hooks/` folder

Hooks used to be spread three ways: React Query hooks in a feature `hooks.ts`, auth form hooks in `auth/hooks/`, and UI hooks inside widget folders (`components/<audience>/<widget>/hooks/`). Finding a hook meant searching several nesting levels, and each feature looked different. Now every feature hook sits in `src/features/<domain>/hooks/`, one `use<Name>.ts` per hook, next to `schemas.ts`, `actions.ts`, and `constants.ts`; `components/` holds only components and widget context providers. The trade-off is that deleting a widget no longer removes its hooks with it; features are small enough that the uniform layout is worth more. Widget hooks of shared components (`src/shared/components/header/hooks/`, `UI/map/hooks/`, `UI/uploader/hooks/`) stay next to those self-contained widgets, and `src/shared/hooks/` stays for cross-domain hooks.
