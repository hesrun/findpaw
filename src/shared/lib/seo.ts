import type { Metadata, MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import {
    DEFAULT_OG_IMAGE,
    META_DESCRIPTION_LENGTH,
    OG_LOCALES,
    SITE_NAME,
} from '@shared/constants/seo';

type Locale = (typeof routing.locales)[number];

type PageMetadataInput = {
    // The `locale` route param; unknown values fall back to the default locale.
    locale: string;
    // Locale-less path, e.g. '/pets/123'.
    path: string;
    // Without the site name; the layout's title template adds it.
    title: string;
    description: string;
    image?: { url: string; alt: string };
    type?: 'website' | 'article';
    // The landing page title already names the site.
    absoluteTitle?: boolean;
};

export function toLocale(value: string): Locale {
    return routing.locales.find((l) => l === value) ?? routing.defaultLocale;
}

export function localizedPath(locale: Locale, path: string) {
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

// Canonical for the current locale plus hreflang links for every locale.
// Relative URLs resolve against metadataBase from the locale layout.
export function localizedAlternates(locale: Locale, path: string) {
    const languages: Record<string, string> = Object.fromEntries(
        routing.locales.map((l) => [l, localizedPath(l, path)]),
    );
    languages['x-default'] = localizedPath(routing.defaultLocale, path);
    return { canonical: localizedPath(locale, path), languages };
}

// sitemap.xml entries for one page: a URL per locale, each with hreflang
// links to every locale. Sitemaps need absolute URLs, so the origin is passed in.
export function sitemapEntries(
    origin: string,
    path: string,
    lastModified?: string | null,
): MetadataRoute.Sitemap {
    const { languages } = localizedAlternates(routing.defaultLocale, path);
    const absolute = Object.fromEntries(
        Object.entries(languages).map(([l, url]) => [l, `${origin}${url}`]),
    );
    return routing.locales.map((locale) => ({
        url: `${origin}${localizedPath(locale, path)}`,
        ...(lastModified && { lastModified }),
        alternates: { languages: absolute },
    }));
}

export function metaDescription(text: string | null | undefined) {
    const clean = text?.replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    if (clean.length <= META_DESCRIPTION_LENGTH) return clean;
    return `${clean.slice(0, META_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
}

// The full SEO kit for a public page (docs/seo.md). Next.js merges metadata
// shallowly, so openGraph and twitter are always built here in full.
export function pageMetadata({
    locale: requestedLocale,
    path,
    title,
    description,
    image,
    type = 'website',
    absoluteTitle = false,
}: PageMetadataInput): Metadata {
    const locale = toLocale(requestedLocale);
    const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
    const images = [image ?? { ...DEFAULT_OG_IMAGE, alt: SITE_NAME }];
    const alternates = localizedAlternates(locale, path);

    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates,
        openGraph: {
            title: fullTitle,
            description,
            url: alternates.canonical,
            siteName: SITE_NAME,
            locale: OG_LOCALES[locale],
            type,
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images,
        },
    };
}
