import { toIntlLocale } from './intlLocale';

// Prices and rewards are stored in CZK without a currency column.
export function formatCzk(value: number, locale: string) {
    return new Intl.NumberFormat(toIntlLocale(locale), {
        style: 'currency',
        currency: 'CZK',
        maximumFractionDigits: 0,
    }).format(value);
}
