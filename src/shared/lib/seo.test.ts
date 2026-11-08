import { describe, expect, it } from 'vitest';
import {
    DEFAULT_OG_IMAGE,
    META_DESCRIPTION_LENGTH,
    SITE_NAME,
} from '@shared/constants/seo';
import {
    localizedAlternates,
    localizedPath,
    metaDescription,
    pageMetadata,
    sitemapEntries,
} from './seo';

describe('localizedPath', () => {
    it('adds the locale prefix', () => {
        expect(localizedPath('cs', '/pets')).toBe('/cs/pets');
    });

    it('maps the root to the bare locale', () => {
        expect(localizedPath('en', '/')).toBe('/en');
    });
});

describe('localizedAlternates', () => {
    it('points the canonical at the current locale and lists every locale', () => {
        expect(localizedAlternates('cs', '/about')).toEqual({
            canonical: '/cs/about',
            languages: {
                en: '/en/about',
                cs: '/cs/about',
                'x-default': '/en/about',
            },
        });
    });
});

describe('metaDescription', () => {
    it('returns an empty string for missing text', () => {
        expect(metaDescription(null)).toBe('');
        expect(metaDescription('   ')).toBe('');
    });

    it('collapses whitespace', () => {
        expect(metaDescription(' Lost\n\ncat   near park ')).toBe(
            'Lost cat near park',
        );
    });

    it('cuts long text to the limit with an ellipsis', () => {
        const result = metaDescription('a'.repeat(META_DESCRIPTION_LENGTH + 50));
        expect(result).toHaveLength(META_DESCRIPTION_LENGTH);
        expect(result.endsWith('…')).toBe(true);
    });
});

describe('pageMetadata', () => {
    const base = {
        locale: 'cs',
        path: '/pets',
        title: 'Pets',
        description: 'Listings',
    };

    it('builds the full kit with the default image', () => {
        const meta = pageMetadata(base);
        expect(meta.title).toBe('Pets');
        expect(meta.alternates?.canonical).toBe('/cs/pets');
        expect(meta.openGraph).toMatchObject({
            title: `Pets | ${SITE_NAME}`,
            url: '/cs/pets',
            locale: 'cs_CZ',
            type: 'website',
            siteName: SITE_NAME,
            images: [{ ...DEFAULT_OG_IMAGE, alt: SITE_NAME }],
        });
        expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
    });

    it('uses the page image and type when given', () => {
        const image = { url: 'https://example.com/a.jpg', alt: 'Rex' };
        const meta = pageMetadata({ ...base, image, type: 'article' });
        expect(meta.openGraph).toMatchObject({ type: 'article', images: [image] });
    });

    it('keeps an absolute title without the site name', () => {
        const meta = pageMetadata({ ...base, title: 'FindPaw', absoluteTitle: true });
        expect(meta.title).toEqual({ absolute: 'FindPaw' });
        expect(meta.openGraph?.title).toBe('FindPaw');
    });

    it('falls back to the default locale for unknown values', () => {
        expect(pageMetadata({ ...base, locale: 'xx' }).alternates?.canonical).toBe(
            '/en/pets',
        );
    });
});

describe('sitemapEntries', () => {
    it('returns an absolute URL per locale with hreflang links', () => {
        const entries = sitemapEntries('https://findpaw.cz', '/pets/1', '2026-11-08');
        expect(entries.map((e) => e.url)).toEqual([
            'https://findpaw.cz/en/pets/1',
            'https://findpaw.cz/cs/pets/1',
        ]);
        expect(entries[0]).toMatchObject({
            lastModified: '2026-11-08',
            alternates: {
                languages: {
                    en: 'https://findpaw.cz/en/pets/1',
                    cs: 'https://findpaw.cz/cs/pets/1',
                    'x-default': 'https://findpaw.cz/en/pets/1',
                },
            },
        });
    });

    it('omits lastModified when the date is missing', () => {
        expect(sitemapEntries('https://findpaw.cz', '/', null)[0]).not.toHaveProperty(
            'lastModified',
        );
    });
});
