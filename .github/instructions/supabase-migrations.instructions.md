---
name: Supabase migrations
applyTo: 'supabase/migrations/**/*.sql'
description: 'Use when changing Supabase schema, policies, functions, or storage rules.'
---

Read `docs/database.md` before editing.

- Add a new timestamped migration; do not edit an applied migration.
- Enable RLS for new application tables.
- Add policies for every required operation and verify owner/public access explicitly.
- Consider storage policies and delete behavior for related data.
- After applying a migration, run `npm run gentypes` and update affected feature schemas and queries.
