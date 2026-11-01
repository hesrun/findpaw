'use client';

import { createContext, use, type ReactNode } from 'react';
import { useCatalogUrl, type CatalogUrlState } from './hooks/useCatalogUrl';

// One instance of the catalog URL state, shared by the sidebar, the mobile
// drawer, the toolbar, the chips and the results wrapper.
const CatalogFiltersContext = createContext<CatalogUrlState | null>(null);

export function CatalogFiltersProvider({ children }: { children: ReactNode }) {
    const value = useCatalogUrl();
    return (
        <CatalogFiltersContext value={value}>{children}</CatalogFiltersContext>
    );
}

export function useCatalogFilters() {
    const value = use(CatalogFiltersContext);
    if (!value) {
        throw new Error(
            'useCatalogFilters must be used inside CatalogFiltersProvider',
        );
    }
    return value;
}
