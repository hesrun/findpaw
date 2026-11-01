import { Enums } from '@supabase/database.types';
import clsx from 'clsx';

interface ListingChipProps {
    label: string;
    type?: Enums<'pet_listing_type'>;
    className?: string;
}

// Sentence-case pill with a colored dot: readable on photos and on white cards.
const DOT_COLORS = {
    sale: 'bg-emerald-500',
    adoption: 'bg-violet-500',
    lost: 'bg-rose-500',
    found: 'bg-amber-500',
} satisfies Record<Enums<'pet_listing_type'>, string>;

export default function ListingChip({ label, type, className }: ListingChipProps) {
    return (
        <span
            className={clsx(
                'inline-flex max-w-max items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-extrabold text-foreground ring-1 ring-border',
                className,
            )}
        >
            {type && (
                <i
                    aria-hidden
                    className={clsx('size-2 rounded-full', DOT_COLORS[type])}
                />
            )}
            {label}
        </span>
    );
}
