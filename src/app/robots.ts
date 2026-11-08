import type { MetadataRoute } from 'next';
import { SITE_URL } from '@shared/constants/seo';

// Auth and dashboard pages are not disallowed here: they send robots noindex,
// and a crawler blocked by robots.txt would never see it.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: '*', allow: '/', disallow: '/api/' },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
