'use client';

import { Switch } from '@heroui/react';
import { useTranslations } from 'next-intl';
import {
    CATALOG_FLAG_FILTER_KEYS,
    CATALOG_FLAG_LABEL_KEYS,
} from '@features/pets/constants';
import { useCatalogFilters } from '../CatalogFiltersContext';
import FilterGroup from './FilterGroup';

export default function FlagSwitches() {
    const t = useTranslations('petsPage.filters');
    const { filters, navigate } = useCatalogFilters();

    return (
        <FilterGroup label={t('more')}>
            {CATALOG_FLAG_FILTER_KEYS.map((key) => (
                <Switch
                    key={key}
                    isSelected={!!filters[key]}
                    onChange={(isSelected) =>
                        navigate({ [key]: isSelected ? 'true' : null })
                    }
                    className="justify-between"
                >
                    <Switch.Content className="text-sm mr-auto">
                        {t(CATALOG_FLAG_LABEL_KEYS[key])}
                    </Switch.Content>
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                </Switch>
            ))}
        </FilterGroup>
    );
}
