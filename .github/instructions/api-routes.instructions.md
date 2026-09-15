---
name: API route handlers
applyTo: 'src/app/api/**/route.ts'
description: 'Use when changing Next.js API route handlers.'
---

Read `docs/architecture.md` and the relevant feature document before editing.

- Keep route handlers thin: parse the request, call feature code, and return an HTTP response.
- Do not duplicate Supabase queries or business rules in route handlers.
- Do not expose raw internal error messages to clients.
- Type dynamic route params explicitly; do not use `any`.
- Preserve authentication, ownership, and RLS behavior.
