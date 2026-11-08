# FindPaw

FindPaw is a localized application for publishing, discovering, and managing pet listings and shelter profiles.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Supabase for authentication, database, storage, and Row-Level Security
- `next-intl` for English and Czech locales
- TanStack Query for client-side server state
- Zod for runtime validation at external input boundaries
- HeroUI, Tailwind CSS, and Framer Motion for the interface

## Getting Started

Requirements:

- Node.js compatible with the repository toolchain;
- npm;
- a configured Supabase project;
- the variables listed in `.env.example`.

Install dependencies and start development:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and fill in local values. Never commit `.env.local` or service-role credentials.

## Commands

| Command                  | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start the development server            |
| `npm run lint`           | Run ESLint                              |
| `npm run typecheck`      | Run TypeScript without emitting files   |
| `npm run build`          | Create a production build               |
| `npm run check`          | Run lint, typecheck, and build          |
| `npm run start`          | Start the production build              |
| `npm run login`          | Authenticate the Supabase CLI           |
| `npm run migration:push` | Apply pending Supabase migrations       |
| `npm run gentypes`       | Regenerate `supabase/database.types.ts` |

## Project Structure

```text
src/app/       routes, layouts, and API route handlers
src/features/  domain modules: pets, shelters, auth, account
src/shared/    reusable UI, providers, helpers, and Supabase clients
src/i18n/      locale routing and request configuration
supabase/      migrations, policies, and generated database types
messages/      locale message catalogs
```

## Documentation

- [Architecture](docs/architecture.md)
- [Development guide](docs/development.md)
- [Database and Supabase](docs/database.md)
- [Internationalization](docs/i18n.md)
- [SEO](docs/seo.md)
- [Account feature](docs/features/account.md)
- [Pets feature](docs/features/pets.md)
- [Shelters feature](docs/features/shelters.md)
- [Decisions](docs/decisions.md)

Before changing code, read `AGENTS.md` and the relevant document above. `CLAUDE.md` imports `AGENTS.md` for Claude Code; step-by-step procedures live in `.claude/skills/`.
