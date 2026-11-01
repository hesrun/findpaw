'use client';

import { ListBox, Select } from '@heroui/react';
import { useTranslations } from 'next-intl';
import {
    CATALOG_SORT_KEYS,
    type CatalogSortKey,
} from '@features/pets/constants';
import { useCatalogSort } from './hooks/useCatalogSort';

export default function SortSelect() {
    const t = useTranslations('petsPage.filters');
    const { sortKey, changeSort } = useCatalogSort();

    return (
        <Select
            value={sortKey}
            onChange={(key) => key && changeSort(key as CatalogSortKey)}
            variant="secondary"
            aria-label={t('sort')}
            className="w-full sm:w-56"
        >
            <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {CATALOG_SORT_KEYS.map((key) => (
                        <ListBox.Item
                            key={key}
                            id={key}
                            textValue={t(`sortOptions.${key}`)}
                        >
                            {t(`sortOptions.${key}`)}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}
