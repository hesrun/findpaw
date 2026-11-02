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

## Open: image storage

Pet images are uploaded to Cloudinary from the client with an unsigned preset, while Supabase Storage buckets and policies also exist. One storage provider should be chosen, and uploads should be signed or validated on the server.

## Password recovery and sign-up confirmation through `token_hash` and `/api/auth/confirm`

The reset and sign-up confirmation emails link to `/api/auth/confirm`, which calls `verifyOtp` with the `token_hash` and then redirects by link type (`AUTH_CONFIRM_REDIRECTS`): `recovery` to `/<locale>/reset-password`, `email` to the dashboard. The PKCE `code` flow was rejected because it only works in the browser that requested the reset, and users often open the email on another device. This needs a custom "Reset Password" email template (see `docs/development.md`). The handler sits under `/api` so the next-intl proxy does not add a locale prefix; the locale travels as a query parameter validated against `routing.locales`, and the redirect target is built on the server, so the link cannot redirect off the site. `requestPasswordReset` always reports success so the form does not reveal which emails have accounts. `/reset-password` is not an auth path in `src/proxy.ts`: the recovery link signs the user in, so the page requires a session and sends visitors without one back to `/forgot-password?error=linkExpired`.

Auth emails are English-only for the MVP. Supabase has one template per email type, and per-locale emails would need either locale conditions on `user_metadata` or a Send Email Hook; the hook (React Email with `messages/*.json`) is the planned path once localized emails matter.
