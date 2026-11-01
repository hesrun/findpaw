'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useCatalogFilters } from './CatalogFiltersContext';

// Dims the server-rendered results while a filter navigation is pending.
export default function CatalogResults({ children }: { children: ReactNode }) {
    const { isPending } = useCatalogFilters();

    return (
        <div
            aria-busy={isPending}
            className={clsx(
                'transition-opacity duration-300',
                isPending && 'opacity-50 pointer-events-none',
            )}
        >
            {children}
        </div>
    );
}
