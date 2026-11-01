'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCatalogFilters } from '../CatalogFiltersContext';

// Text-style "Clear all" link used in the sidebar header and after the chips.
export default function ClearFiltersButton({
    className,
}: {
    className?: string;
}) {
    const t = useTranslations('petsPage.filters');
    const { reset } = useCatalogFilters();

    return (
        <button
            type="button"
            onClick={reset}
            className={clsx(
                'text-sm font-heading font-bold text-accent hover:underline cursor-pointer',
                className,
            )}
        >
            {t('clearAll')}
        </button>
    );
}
