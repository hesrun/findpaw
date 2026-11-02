// Prices and rewards are stored in CZK without a currency column.
export function formatCzk(value: number, locale: string) {
    return new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'en-US', {
        style: 'currency',
        currency: 'CZK',
        maximumFractionDigits: 0,
    }).format(value);
}
