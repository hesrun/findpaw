'use client';

import { Input, Label, TextField } from '@heroui/react';
import type { CatalogTextKey } from '@features/pets/constants';
import { useCatalogFilters } from '../CatalogFiltersContext';

type TextFilterFieldProps = {
    name: CatalogTextKey;
    label: string;
    placeholder?: string;
    numeric?: boolean;
};

// A debounced text filter bound to one URL parameter.
export default function TextFilterField({
    name,
    label,
    placeholder,
    numeric = false,
}: TextFilterFieldProps) {
    const { text, changeText } = useCatalogFilters();

    return (
        <TextField
            value={text[name]}
            onChange={(value) => changeText(name, value)}
            variant="secondary"
        >
            <Label>{label}</Label>
            {numeric ? (
                <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder={placeholder}
                />
            ) : (
                <Input placeholder={placeholder} />
            )}
        </TextField>
    );
}
