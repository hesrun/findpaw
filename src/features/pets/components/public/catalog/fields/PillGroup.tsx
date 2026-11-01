'use client';

import clsx from 'clsx';
import { CATALOG_ALL_OPTION } from '@features/pets/constants';
import FilterGroup from './FilterGroup';

const PILL_BASE_CLASS =
    'px-3.5 py-1.5 rounded-full text-sm font-heading font-bold transition-colors duration-300 cursor-pointer';
const PILL_ACTIVE_CLASS =
    'bg-accent text-accent-foreground shadow-[0_8px_18px_-8px_color-mix(in_oklch,var(--accent)_55%,transparent)]';
const PILL_INACTIVE_CLASS =
    'bg-surface text-muted ring-1 ring-border hover:text-accent';

type PillGroupProps<T extends string> = {
    label: string;
    // Label of the leading "no filter" pill.
    allLabel: string;
    options: readonly { id: T; label: string }[];
    value: T | null;
    onChange: (id: T | null) => void;
};

// Single-choice toggle buttons with a leading "All" pill.
export default function PillGroup<T extends string>({
    label,
    allLabel,
    options,
    value,
    onChange,
}: PillGroupProps<T>) {
    const items = [{ id: null, label: allLabel }, ...options];

    return (
        <FilterGroup label={label}>
            <div className="flex flex-wrap gap-2">
                {items.map(({ id, label: itemLabel }) => (
                    <button
                        key={id ?? CATALOG_ALL_OPTION}
                        type="button"
                        aria-pressed={value === id}
                        className={clsx(
                            PILL_BASE_CLASS,
                            value === id
                                ? PILL_ACTIVE_CLASS
                                : PILL_INACTIVE_CLASS,
                        )}
                        onClick={() => onChange(id)}
                    >
                        {itemLabel}
                    </button>
                ))}
            </div>
        </FilterGroup>
    );
}
