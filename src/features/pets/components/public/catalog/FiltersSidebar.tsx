'use client';

import { useTranslations } from 'next-intl';
import FiltersPanel from './FiltersPanel';
import ClearFiltersButton from './fields/ClearFiltersButton';
import { useActiveFilterChips } from './hooks/useActiveFilterChips';

// Desktop filters; the mobile layout uses FiltersDrawer instead.
export default function FiltersSidebar() {
    const t = useTranslations('petsPage.filters');
    const { chips } = useActiveFilterChips();

    return (
        <aside
            aria-label={t('title')}
            className="hidden lg:block sticky top-6 bg-surface rounded-card shadow-my ring-1 ring-border p-5"
        >
            <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display font-extrabold text-xl">
                    {t('title')}
                </h2>
                {chips.length > 0 && <ClearFiltersButton />}
            </div>
            <FiltersPanel />
        </aside>
    );
}
