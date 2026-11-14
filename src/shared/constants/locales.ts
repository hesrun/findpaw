import type { Locale } from '@/i18n/routing';

// BCP 47 tags for Intl date and number formatting.
export const INTL_LOCALES = {
    en: 'en-US',
    cs: 'cs-CZ',
    uk: 'uk-UA',
} satisfies Record<Locale, string>;

// Short labels in the language switcher. Ukrainian shows the country code:
// its language code "UK" reads as the United Kingdom.
export const LOCALE_LABELS = {
    en: 'EN',
    cs: 'CS',
    uk: 'UA',
} satisfies Record<Locale, string>;
