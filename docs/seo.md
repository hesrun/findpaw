# SEO

Every public page gets the full SEO kit in the same change that adds the page. A public page without it is not finished. "Public" means any page an anonymous visitor can open and a search engine can index: the landing, catalogs, detail pages, about, and legal pages.

## Full SEO kit for a public page

1. **Server-rendered content.** The main content is in the first server response (see "SEO-first public listing" and "URL-driven public catalog" in `docs/architecture.md`). Content loaded only on the client is invisible to search engines and link previews.
2. **`generateMetadata` built with `pageMetadata()`** from `src/shared/lib/seo.ts`. Pass the `locale` route param, the locale-less `path`, a localized `title` and `description` from the message files, and for detail pages the record's first photo as `image` and `type: 'article'`. `pageMetadata()` returns everything else: canonical and hreflang alternates for every locale (plus `x-default`), the full Open Graph block, and the Twitter card. Never write these fields by hand in a route file.
3. **Titles without the site name.** The locale layout sets `title.template` (`%s | FindPaw`); `pageMetadata()` adds the name to the Open Graph and Twitter titles. Only the landing page uses `absoluteTitle`, because its title already names the site.
4. **Descriptions through `metaDescription()`** when they come from user text or long copy: it collapses whitespace and cuts to `META_DESCRIPTION_LENGTH`. Detail pages fall back to the section description when the record has none.
5. **Sitemap entry.** A static page adds its path to `SITEMAP_STATIC_PATHS` in `src/shared/constants/seo.ts`. A new detail page type adds a `getSitemap<Domain>()` query (ids and `updated_at` of public records only, with the same visibility filter as the public query) and maps it through `sitemapEntries()` in `src/app/sitemap.ts`.
6. **Catalog filters and pagination** share the catalog canonical, so filter combinations are not indexed as separate pages.

## Non-public pages

Auth pages and the dashboard send `robots: { index: false, follow: false }` from their layouts (`(auth)/layout.tsx`, `dashboard/layout.tsx`); a new private section does the same in its layout. They are not listed in the sitemap. They are not disallowed in `robots.txt`: a crawler blocked there never sees the `noindex`. They inherit the default site title from the locale layout. Missing and hidden records render the 404 page with `robots noindex` (see `src/app/[locale]/(public)/pets/[id]/page.tsx`).

## Site-wide pieces

- `src/app/[locale]/layout.tsx`: `metadataBase` from `SITE_URL`, the title template with the localized default title, and the default description, Open Graph, and Twitter blocks for pages without their own. It sets no canonical, so pages never inherit the landing page's canonical.
- `SITE_URL` comes from `NEXT_PUBLIC_SITE_URL` (the production origin, `https://findpaw.cz`); set it in the hosting environment, otherwise canonical and sitemap URLs point to `localhost`.
- `public/og-image.png` (1200×630) is the default preview image. It is rendered from `public/logo/LogoColor.svg`; re-render it when the logo changes.
- `src/app/robots.ts` allows everything except `/api/` and links the sitemap. `src/app/sitemap.ts` lists a URL per locale for every static page, public pet, and shelter, each with hreflang links. Both follow the Next.js 16 metadata file conventions (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/`).
- Next.js merges metadata shallowly: a page that sets `openGraph` replaces the layout's block entirely. That is why `pageMetadata()` always returns complete `openGraph` and `twitter` blocks.
- Structured data (JSON-LD) is not used yet.
