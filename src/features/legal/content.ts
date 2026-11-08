import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getLocale } from 'next-intl/server';
import cs from '@messages/legal/cs.json';
import en from '@messages/legal/en.json';
import { routing } from '@/i18n/routing';
import { LEGAL_ROUTES } from '@shared/constants/legal';
import { metaDescription, pageMetadata } from '@shared/lib/seo';

// Long legal texts stay out of messages/*.json: NextIntlClientProvider
// sends those to the browser on every page. Import this file only from
// Server Components.
const LEGAL_CONTENT = { en, cs } satisfies Record<
    (typeof routing.locales)[number],
    typeof en
>;

export type LegalDocumentType = 'privacy' | 'terms';

export async function getLegalContent() {
    const requested = await getLocale();
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;
    return { locale, content: LEGAL_CONTENT[locale] };
}

// Shared generateMetadata body for /privacy and /terms.
export async function getLegalMetadata(
    type: LegalDocumentType,
): Promise<Metadata> {
    const { locale, content } = await getLegalContent();
    const document = content[type];
    return pageMetadata({
        locale,
        path: LEGAL_ROUTES[type],
        title: document.metaTitle,
        description: metaDescription(document.intro[0]),
    });
}
