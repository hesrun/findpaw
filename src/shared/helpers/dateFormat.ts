// const iso = '2026-05-27T15:08:02.868+00:00';

// formatDate(iso, { locale: 'cs', format: 'short' }); // "27. 5. 2026"
// formatDate(iso, { locale: 'cs', format: 'medium' }); // "27. května 2026"
// formatDate(iso, { locale: 'cs', format: 'long' }); // "27. května 2026 v 15:08"
// formatDate(iso, { locale: 'cs', format: 'relative' }); // "před 4 dny"

// formatDate(iso, { locale: 'en', format: 'short' }); // "5/27/2026"
// formatDate(iso, { locale: 'en', format: 'medium' }); // "May 27, 2026"
// formatDate(iso, { locale: 'en', format: 'long' }); // "May 27, 2026 at 03:08 PM"
// formatDate(iso, { locale: 'en', format: 'relative' }); // "4 days ago"

import { toIntlLocale } from './intlLocale';

interface FormatDateOptions {
    locale: string;
    format?: 'short' | 'medium' | 'long' | 'relative';
}

export function formatDate(
    input: string | Date,
    { locale, format = 'medium' }: FormatDateOptions,
): string {
    const date = typeof input === 'string' ? new Date(input) : input;
    const loc = toIntlLocale(locale);

    switch (format) {
        case 'short':
            return new Intl.DateTimeFormat(loc, {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            }).format(date);

        case 'medium':
            return new Intl.DateTimeFormat(loc, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(date);

        case 'long':
            return new Intl.DateTimeFormat(loc, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);

        case 'relative':
            return formatRelative(date, loc);

        default:
            return date.toISOString();
    }
}

function formatRelative(date: Date, loc: string): string {
    const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });
    const diffMs = date.getTime() - Date.now();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);

    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
    if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
    return rtf.format(diffYear, 'year');
}
