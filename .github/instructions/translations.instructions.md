---
name: Translation files
applyTo: 'messages/*.json'
description: 'Use when changing localized user-visible text.'
---

Read `docs/i18n.md` before editing translations.

- Keep `messages/en.json` and `messages/cs.json` structurally synchronized.
- Add user-visible strings to both locale files in the same change.
- Do not hardcode new user-visible text in JSX.
- Preserve existing namespaces and interpolation parameters.
