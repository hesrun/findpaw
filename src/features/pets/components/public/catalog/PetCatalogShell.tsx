import type { ReactNode } from 'react';
import ActiveFilterChips from './ActiveFilterChips';
import { CatalogFiltersProvider } from './CatalogFiltersContext';
import CatalogResults from './CatalogResults';
import CatalogToolbar from './CatalogToolbar';
import FiltersSidebar from './FiltersSidebar';

// Layout of the public catalog (/pets): filters around server-rendered results
// passed in as children. All filter state lives in the URL.
export default function PetCatalogShell({ children }: { children: ReactNode }) {
    return (
        <CatalogFiltersProvider>
            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
                <FiltersSidebar />
                <div className="min-w-0">
                    <CatalogToolbar />
                    <ActiveFilterChips />
                    <CatalogResults>{children}</CatalogResults>
                </div>
            </div>
        </CatalogFiltersProvider>
    );
}
