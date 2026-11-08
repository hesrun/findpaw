import type { routing } from '@/i18n/routing';
import { LEGAL_ROUTES } from './legal';

export const SITE_NAME = 'FindPaw';

// Absolute origin for canonical URLs, Open Graph, robots.txt and the sitemap.
// Set NEXT_PUBLIC_SITE_URL to the production origin in the hosting settings.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Shared preview for pages without their own photo (public/og-image.png).
export const DEFAULT_OG_IMAGE = {
    url: '/og-image.png',
    width: 1200,
    height: 630,
} as const;

export const OG_LOCALES = {
    en: 'en_US',
    cs: 'cs_CZ',
} satisfies Record<(typeof routing.locales)[number], string>;

// Search engines cut longer descriptions.
export const META_DESCRIPTION_LENGTH = 160;

// Locale-less paths of public pages without a dynamic segment (sitemap.ts).
export const SITEMAP_STATIC_PATHS = [
    '/',
    '/pets',
    '/shelters',
    '/about',
    LEGAL_ROUTES.privacy,
    LEGAL_ROUTES.terms,
] as const;
