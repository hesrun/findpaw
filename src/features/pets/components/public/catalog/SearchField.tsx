'use client';

import { Input, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { LuSearch } from 'react-icons/lu';
import { useCatalogFilters } from './CatalogFiltersContext';

export default function SearchField() {
    const t = useTranslations('petsPage.filters');
    const { text, changeText } = useCatalogFilters();

    return (
        <TextField
            value={text.q}
            onChange={(value) => changeText('q', value)}
            variant="secondary"
            aria-label={t('search')}
            className="grow basis-60"
        >
            <div className="relative">
                <LuSearch
                    aria-hidden
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <Input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    className="pl-9 w-full"
                />
            </div>
        </TextField>
    );
}
