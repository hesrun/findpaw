import { hasLocale } from 'next-intl';
import { getLocale } from 'next-intl/server';
import cs from '@messages/legal/cs.json';
import en from '@messages/legal/en.json';
import { routing } from '@/i18n/routing';

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
