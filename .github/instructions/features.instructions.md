---
name: Feature modules
applyTo: 'src/features/**/*.{ts,tsx}'
description: 'Use when changing domain features, queries, actions, schemas, hooks, or feature components.'
---

Read the relevant document in `docs/features/` before editing a domain feature.

- Keep domain-specific logic inside `src/features/<domain>`.
- Put reads in `queries.ts`, browser mutations in server `actions.ts`, runtime input validation in `schemas.ts`, and client fetching in `hooks.ts`.
- Validate `FormData`, URL parameters, and external JSON on the server.
- Preserve ownership checks and Supabase RLS.
- Use generated Supabase types for database rows and payloads.
- Keep UI components free of direct Supabase access.
