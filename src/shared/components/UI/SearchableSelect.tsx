'use client';

import {
    Autocomplete,
    EmptyState,
    Label,
    ListBox,
    SearchField,
    useFilter,
} from '@heroui/react';
import type { ComponentProps } from 'react';

type SearchableSelectProps = Omit<
    ComponentProps<typeof Autocomplete>,
    'children'
> & {
    label: string;
    searchPlaceholder: string;
    emptyText: string;
    options: readonly { id: string; label: string }[];
};

// Selected labels joined with commas. The default joiner follows the browser
// language ("a and b"), not the site locale.
function joinSelected(state: { selectedItems: { textValue: string }[] }) {
    return state.selectedItems.map((item) => item.textValue).join(', ');
}

// Select with a search box in its popover, for long option lists. Single or
// multiple selection, controlled or not: the Autocomplete props pass through.
export default function SearchableSelect({
    label,
    searchPlaceholder,
    emptyText,
    options,
    ...props
}: SearchableSelectProps) {
    // Ignores case and accents, so "britska" finds "Britská".
    const { contains } = useFilter({ sensitivity: 'base' });

    return (
        <Autocomplete {...props}>
            <Label>{label}</Label>
            <Autocomplete.Trigger>
                <Autocomplete.Value>
                    {({ defaultChildren, isPlaceholder, state }) =>
                        isPlaceholder ? defaultChildren : joinSelected(state)
                    }
                </Autocomplete.Value>
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
                <Autocomplete.Filter filter={contains}>
                    <SearchField
                        autoFocus
                        aria-label={searchPlaceholder}
                        variant="secondary"
                    >
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder={searchPlaceholder} />
                            <SearchField.ClearButton />
                        </SearchField.Group>
                    </SearchField>
                    <ListBox
                        renderEmptyState={() => (
                            <EmptyState>{emptyText}</EmptyState>
                        )}
                    >
                        {options.map((option) => (
                            <ListBox.Item
                                key={option.id}
                                id={option.id}
                                textValue={option.label}
                            >
                                {option.label}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Autocomplete.Filter>
            </Autocomplete.Popover>
        </Autocomplete>
    );
}
