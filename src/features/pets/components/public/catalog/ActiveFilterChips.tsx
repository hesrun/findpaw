'use client';

import { useTranslations } from 'next-intl';
import { LuX } from 'react-icons/lu';
import ClearFiltersButton from './fields/ClearFiltersButton';
import { useActiveFilterChips } from './hooks/useActiveFilterChips';

export default function ActiveFilterChips() {
    const t = useTranslations('petsPage.filters');
    const { chips, removeFilter } = useActiveFilterChips();

    if (chips.length === 0) return null;

    return (
        <ul
            aria-label={t('activeFilters')}
            className="flex flex-wrap items-center gap-2 mb-4"
        >
            {chips.map(({ key, label }) => (
                <li key={key}>
                    <button
                        type="button"
                        onClick={() => removeFilter(key)}
                        aria-label={t('removeFilter', { label })}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-soft pl-3 pr-2 py-1 text-sm font-bold text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        {label}
                        <LuX aria-hidden className="size-3.5" />
                    </button>
                </li>
            ))}
            {chips.length > 1 && (
                <li>
                    <ClearFiltersButton className="px-1" />
                </li>
            )}
        </ul>
    );
}
