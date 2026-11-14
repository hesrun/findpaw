# Development Guide

## Prerequisites

- Node.js version compatible with the repository toolchain;
- npm;
- a configured Supabase project;
- the required environment variables from `.env.example`.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` after the development server starts.

Copy `.env.example` to `.env.local` and fill in the values locally. Never commit `.env.local` or secret values.

## Available Commands

| Command                  | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start the Next.js development server    |
| `npm run lint`           | Run ESLint                              |
| `npm run build`          | Create a production build               |
| `npm run start`          | Start the production build              |
| `npm run typecheck`      | Run TypeScript without emitting files   |
| `npm run test`           | Run unit tests once                     |
| `npm run test:watch`     | Run unit tests in watch mode            |
| `npm run check`          | Run lint, typecheck, tests, and build   |
| `npm run login`          | Authenticate the Supabase CLI           |
| `npm run migration:push` | Apply pending Supabase migrations       |
| `npm run gentypes`       | Regenerate `supabase/database.types.ts` |

## Workflows

Step-by-step procedures are Claude Code skills:

- new domain feature: `.claude/skills/new-feature/SKILL.md`;
- schema, policy, or storage change: `.claude/skills/migration/SKILL.md`.

Run the narrowest relevant check after an edit, then `npm run check` before sharing the change.

## Testing

Unit tests use Vitest (`vitest.config.mts`) and run in Node without a DOM, network, or database. They cover pure logic only:

- Zod schemas in feature `schemas.ts`;
- form and schema building blocks in `src/shared/lib/form.ts`;
- other pure functions: mappers, URL parsing, derived values.

Test files sit next to the code as `<name>.test.ts`. Build test input the way the browser sends it (strings, `""` for empty fields, missing unchecked checkboxes) and import limits from `constants.ts` instead of repeating the numbers.

Not covered yet: components, server actions with Supabase, RLS policies, and end-to-end flows. Logic that needs a test belongs in a pure function, not inside a component or a server action with side effects.

## Validation Boundaries

Use runtime validation at external boundaries:

- `FormData` in server actions;
- URL search parameters in API routes and queries;
- JSON request bodies;
- data received from external services.

Use generated Supabase types for data already inside the typed application flow and for database insert/update contracts. Do not rely on TypeScript alone to validate browser input.

## Environment Safety

Variables prefixed with `NEXT_PUBLIC_` may be available in browser code. Service-role credentials and other secrets must remain server-only and must never be prefixed with `NEXT_PUBLIC_` or exposed to client components.

## Supabase Auth Setup

Sign-up confirmation and password recovery need these settings in the Supabase Dashboard:

1. Authentication → URL Configuration → Redirect URLs: add `http://localhost:3000/**` and the production origin with `/**`.
2. Authentication → Emails → Templates: the email templates live in `supabase/templates/` and are the source of truth. The local stack loads them through `supabase/config.toml`; the hosted project does not, so after changing a template paste its HTML and subject into the Dashboard by hand:
    - Confirm sign up ← `supabase/templates/confirmation.html`, subject "Confirm your email";
    - Reset password ← `supabase/templates/recovery.html`, subject "Reset your password".

    Each link carries the token hash to the app's confirm route, for example:

    ```html
    <a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">Reset password</a>
    ```

    `redirectTo` / `emailRedirectTo` is built by `requestPasswordReset` and `signUp` as `<origin>/api/auth/confirm?locale=<locale>`, so the template appends parameters with `&`. Emails are English-only for now.

    The logo is loaded from `{{ .SiteURL }}/logo/logo-email.png`, a PNG rendered from `public/logo/LogoColor.svg` (Gmail and Outlook do not show SVG). It only loads when Site URL is a public origin, so it is missing in emails from the local stack. Re-render the PNG when the logo changes.

`supabase config push` is not used for this: it pushes the whole local Auth config, including the local `site_url`, rate limits, and `enable_confirmations = false`.

## Email and DNS

- DNS for `findpaw.cz` is managed in Cloudflare (the domain's NS records point there). The SPF, DKIM, and DMARC records that let Brevo send for the domain live there too.
- Supabase Auth sends its emails (sign-up confirmation, password reset) through Brevo SMTP, set in Supabase Dashboard → Authentication → SMTP Settings. The sender is `noreply@findpaw.cz`; replies to it are not read. The built-in Supabase email service sends only a few emails per hour, so it is not used in production.
- `info@findpaw.cz` is the contact address (`LEGAL_OPERATOR.email`) and the sender for informational emails. It has no mailbox: Cloudflare Email Routing forwards it to the owner's inbox.
- The Brevo SMTP key is stored only in the Supabase Dashboard, never in the repository or `.env` files.

## Bot Protection (Turnstile)

- The widget is created in Cloudflare Dashboard → Turnstile (Managed mode, hostnames `findpaw.cz` and `localhost`).
- Its site key is `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (`.env.local`, Vercel env). Its secret key is stored only in Supabase Dashboard → Authentication → Attack Protection → Captcha (provider Turnstile).
- Turn captcha on in Supabase only after the site key is deployed: from that moment every sign-up, sign-in, and password reset without a token fails.
- The local Supabase stack has captcha off (`[auth.captcha]` in `supabase/config.toml`), so the widget is optional there.

## Error Tracking (Sentry)

- Sentry organization in the EU data region, project `findpaw` (platform Next.js).
- `NEXT_PUBLIC_SENTRY_DSN` turns reporting on (Vercel env; leave it out of `.env.local` unless you test Sentry locally).
- `SENTRY_AUTH_TOKEN` (organization token) is set only in Vercel; the build uses it to upload source maps.
- The environment of an event is `NEXT_PUBLIC_VERCEL_ENV` (`production` or `preview`), `development` locally.
