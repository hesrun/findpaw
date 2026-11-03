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

Images go from the browser straight to Cloudinary, so files never pass through our server or its request size limit. The upload is signed: `signImageUpload` (`src/shared/lib/cloudinary/actions.ts`) checks the session and signs the folder (`<pets|shelters>/<user id>`), the timestamp, and the allowed formats with `CLOUDINARY_API_SECRET`; Cloudinary rejects any changed parameter. The old unsigned preset let anyone upload to the account with values from the client bundle. The signature is a SHA-1 over the sorted parameters, done with `node:crypto` instead of the Cloudinary SDK. Saved URLs are validated by `imageUrls(max)` in `src/shared/lib/form.ts`: only our cloud, at most the feature's photo limit. Images are shown with `CloudImage` (a client wrapper over next-cloudinary's `CldImage`), so Cloudinary picks size, format, and quality instead of the Next.js image optimizer. The uploader is our own UI on React Aria `DropZone` and `FileTrigger` (already a HeroUI dependency); the Cloudinary upload widget was rejected for its look. Files stay in the browser until the form is saved.

Saving a form or deleting a pet or shelter deletes the photos it no longer uses (`deleteUserImages` in `src/shared/lib/cloudinary/server.ts`, run with `after()` so the response does not wait). Only files inside the user's own folder are deleted: any URL from our cloud may be saved on a listing, so a URL alone does not prove ownership. Older images uploaded before user folders are never deleted. Supabase Storage is not used; its buckets and policies were removed (`20261103000300_drop_storage_buckets.sql`).

## Password recovery and sign-up confirmation through `token_hash` and `/api/auth/confirm`

The reset and sign-up confirmation emails link to `/api/auth/confirm`, which calls `verifyOtp` with the `token_hash` and then redirects by link type (`AUTH_CONFIRM_REDIRECTS`): `recovery` to `/<locale>/reset-password`, `email` to the dashboard. The PKCE `code` flow was rejected because it only works in the browser that requested the reset, and users often open the email on another device. This needs a custom "Reset Password" email template (see `docs/development.md`). The handler sits under `/api` so the next-intl proxy does not add a locale prefix; the locale travels as a query parameter validated against `routing.locales`, and the redirect target is built on the server, so the link cannot redirect off the site. `requestPasswordReset` always reports success so the form does not reveal which emails have accounts. `/reset-password` is not an auth path in `src/proxy.ts`: the recovery link signs the user in, so the page requires a session and sends visitors without one back to `/forgot-password?error=linkExpired`.

Auth emails are English-only for the MVP. Supabase has one template per email type, and per-locale emails would need either locale conditions on `user_metadata` or a Send Email Hook; the hook (React Email with `messages/*.json`) is the planned path once localized emails matter.

## Pet map location: Leaflet with Mapy.com in a modal, rounded point

Every listing type may have a map point, picked in a modal next to the plain city and address fields (an inline map in the narrow location card was too cramped). The text address of a listing was already public, so a rounded point adds little exposure; it also enables a later "near me" search. Reverse geocoding fills the street but never the house number, and runs once per confirmed point, not per click; address search in the modal was left out to stay within the free Mapy.com quota. The server rounds the point to about 100 m and the public page shows a 300 m circle, because people often put the pin on their own house. Tiles and reverse geocoding come from Mapy.com (Seznam): the project is Czech, the maps are the best for the Czech Republic and have cs/en labels, and the free tier is enough. OpenStreetMap with Nominatim was rejected because the public Nominatim allows about one request per second and asks heavy users to run their own server. Leaflet + react-leaflet render the map; the Mapy.com terms require their logo and attribution on every map (`BaseMap`). The API key is public (`NEXT_PUBLIC_MAPY_API_KEY`) because the browser requests tiles; restrict it by HTTP referrer in the Mapy.com console.

## Legal pages under Czech law, kept in sync with features

`/privacy` (GDPR Art. 13, cookies in its `#cookies` section) and `/terms` (Civil Code, Act No. 480/2004 Coll. hosting liability, DSA contact point and notice-and-action) are linked from the footer and the sign-up form. The legal basis for accounts and listings is the contract, not consent, so sign-up shows a notice with links instead of a checkbox. Only strictly necessary cookies are used (Supabase auth, `NEXT_LOCALE`), so there is no cookie banner (§ 89(3) of Act No. 127/2005 Coll.). Account deletion is handled by email request within 30 days until a self-service button exists.

The documents describe what the code does. Any feature that adds personal data fields, a new third-party service, analytics or other non-essential cookies, payments, messaging between users, new public data, or moderation must update `messages/legal/*.json` and `LEGAL_EFFECTIVE_DATE` in the same change, after the change is agreed with the project owner. These texts are a draft written without a lawyer.

**Open** before launch: fill in `LEGAL_OPERATOR`; confirm the hosting provider (Vercel is assumed in the recipients list) and the Supabase region; add the custom SMTP provider to the recipients list once it is chosen.
