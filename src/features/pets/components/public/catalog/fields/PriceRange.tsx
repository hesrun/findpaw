'use client';

import { useTranslations } from 'next-intl';
import TextFilterField from './TextFilterField';

export default function PriceRange() {
    const t = useTranslations('petsPage.filters');

    return (
        <div className="grid grid-cols-2 gap-3">
            <TextFilterField name="min_price" label={t('priceFrom')} numeric />
            <TextFilterField name="max_price" label={t('priceTo')} numeric />
        </div>
    );
}
