import { getTranslations } from 'next-intl/server';

export async function formatAge(
    ageMonth: number,
    type: 'short' | 'full' = 'full',
): Promise<string> {
    const t = await getTranslations('PetAge');
    const years = Math.floor(ageMonth / 12);
    const months = ageMonth % 12;

    if (type === 'short') {
        return ageMonth < 12
            ? t('monthsShort', { count: ageMonth })
            : t('yearsShort', { years });
    }

    // type === 'full'
    if (ageMonth < 12) {
        return t('months', { count: ageMonth });
    }
    if (months === 0) {
        return t('years', { count: years });
    }
    return t('yearsAndMonths', { years, months });
}
