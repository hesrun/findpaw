'use client';

import { Button, Drawer } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { useCatalogFilters } from './CatalogFiltersContext';
import FiltersPanel from './FiltersPanel';
import { useActiveFilterChips } from '@features/pets/hooks/useActiveFilterChips';

// Mobile filters: a trigger with the active filter count and a side drawer.
export default function FiltersDrawer() {
    const t = useTranslations('petsPage.filters');
    const { reset } = useCatalogFilters();
    const { chips } = useActiveFilterChips();
    const hasFilters = chips.length > 0;

    return (
        <Drawer>
            <Button variant="secondary" className="lg:hidden">
                <LuSlidersHorizontal aria-hidden />
                {t('openFilters')}
                {hasFilters && (
                    <span className="ml-1 rounded-full bg-accent text-accent-foreground text-xs px-2 py-0.5">
                        {chips.length}
                    </span>
                )}
            </Button>
            <Drawer.Backdrop>
                <Drawer.Content placement="left">
                    <Drawer.Dialog>
                        <Drawer.CloseTrigger />
                        <Drawer.Header>
                            <Drawer.Heading className="font-display font-extrabold text-xl">
                                {t('title')}
                            </Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body>
                            <FiltersPanel />
                        </Drawer.Body>
                        <Drawer.Footer className="flex gap-2">
                            {hasFilters && (
                                <Button variant="secondary" onPress={reset}>
                                    {t('clearAll')}
                                </Button>
                            )}
                            <Button slot="close" className="flex-1">
                                {t('showResults')}
                            </Button>
                        </Drawer.Footer>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    );
}
