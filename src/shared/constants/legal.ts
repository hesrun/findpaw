// Operator identity shown in the legal documents (GDPR Art. 13, DSA
// contact point) and the footer. TODO: fill in the name before launch.
export const LEGAL_OPERATOR = {
    name: '[Jméno a příjmení]',
    email: 'info@findpaw.cz',
} as const;

// Shown as "Effective from" on both documents. Change it together with
// any change to messages/legal/*.json.
export const LEGAL_EFFECTIVE_DATE = '2026-11-08';

// Locale-less paths; next-intl navigation adds the locale prefix.
export const LEGAL_ROUTES = {
    privacy: '/privacy',
    terms: '/terms',
    cookies: '/privacy#cookies',
} as const;
