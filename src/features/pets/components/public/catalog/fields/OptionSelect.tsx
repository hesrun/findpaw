'use client';

import { Label, ListBox, Select } from '@heroui/react';
import { CATALOG_ALL_OPTION } from '@features/pets/constants';

type OptionSelectProps<T extends string> = {
    label: string;
    // Label of the leading "no filter" option.
    allLabel: string;
    options: readonly { id: T; label: string }[];
    value: T | undefined;
    onChange: (id: T | null) => void;
};

// Select with a leading "All" option that clears the filter.
export default function OptionSelect<T extends string>({
    label,
    allLabel,
    options,
    value,
    onChange,
}: OptionSelectProps<T>) {
    const items = [{ id: CATALOG_ALL_OPTION, label: allLabel }, ...options];

    return (
        <Select
            value={value ?? CATALOG_ALL_OPTION}
            onChange={(key) =>
                onChange(key && key !== CATALOG_ALL_OPTION ? (key as T) : null)
            }
            variant="secondary"
        >
            <Label>{label}</Label>
            <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {items.map(({ id, label: itemLabel }) => (
                        <ListBox.Item key={id} id={id} textValue={itemLabel}>
                            {itemLabel}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}
