# Decisions

A short log of choices that are not obvious from the code. Add an entry when a choice is made or changed. Keep entries brief: what was decided and why. Mark undecided questions as **Open**.

## Server-first public listings with `initialData`

Public landing sections load their first records in a Server Component and pass them to a Client Component as TanStack Query `initialData`. The first response contains the content for SEO and fast display; the client owns only refetching and interactive state.

## Server actions for mutations, API routes for client reads

Browser mutations go through server actions. Internal GET API routes exist only for client-side fetching that needs React Query cache, pagination, or refetching. Server Components call feature queries directly and never call internal API routes.

## Next.js 16 `proxy.ts`

Locale routing and early auth/role redirects live in `src/proxy.ts` (the Next.js 16 replacement for `middleware.ts`). Redirects there are UX only; RLS and server-side checks remain the security boundary.

## Self-selected roles at sign-up, `admin` never

Users pick `user`, `shelter`, or `clinic` at sign-up. The choice travels in user metadata, so the `handle_new_user` trigger accepts it only from that allow-list and falls back to `user`; `admin` is assigned only through the service role or SQL. After sign-up `profiles.role` is the source of truth. RLS policies cannot restrict columns, so `authenticated` has column-level `update` grants only on editable profile fields and no `insert` on `profiles`: the trigger is the only writer of `role`.

## Current user via per-request `cache()`, no client provider

`getCurrentUser` (`src/shared/lib/supabase/auth.ts`) and `getProfile` (`src/shared/lib/supabase/profile.ts`) are wrapped in React `cache()`, so every Server Component in one render shares a single `auth.getUser()` call and a single `profiles` query. The cache lives for one request only, so it never serves stale or another user's data. Server components call these helpers instead of querying Supabase themselves. A client-side user provider is not used yet because almost no client components need the user; when they do, the layout should pass `getProfile()` output into it rather than use the browser Supabase client.

## Pet status and close reason are separate fields

`pets.status` (`active`, `reserved`, `hidden`, `closed`) says what the listing is doing now and drives public visibility; `close_reason` says how a closed listing ended. One long status enum (`adopted`, `sold`, ...) would make the public policy and the UI harder and allow nonsense combinations; with two fields a single check ties the reason to the listing type. `closed_at` is set by a trigger so the date cannot be faked from the client and is ready for "found a home in N days" statistics. `hidden` deliberately has no reason: it is a pause, not an outcome. Moderation (`pending`) is not modelled yet.

## Open: styling approach

HeroUI v3 is built on Tailwind CSS v4 (`@heroui/styles` has `tailwindcss` as a peer dependency), so Tailwind cannot be removed while HeroUI components are in use. The preferred direction is SCSS modules on the existing CSS custom-property tokens in `src/css/styles.css`, possibly replacing HeroUI with React Aria Components over time. Not yet decided.

## Open: image storage

Pet images are uploaded to Cloudinary from the client with an unsigned preset, while Supabase Storage buckets and policies also exist. One storage provider should be chosen, and uploads should be signed or validated on the server.
