import { Enums } from '@supabase/database.types';
import clsx from 'clsx';

interface ListingChipProps {
    label: string;
    type?: Enums<'pet_listing_type'>;
    className?: string;
}

// Solid sentence-case pill with a glow in its own color: readable on photos
// and on white cards.
const CHIP_COLORS = {
    sale: 'bg-emerald-500 shadow-emerald-500/40',
    adoption: 'bg-violet-500 shadow-violet-500/40',
    lost: 'bg-rose-500 shadow-rose-500/40',
    found: 'bg-amber-500 shadow-amber-500/40',
} satisfies Record<Enums<'pet_listing_type'>, string>;

export default function ListingChip({ label, type, className }: ListingChipProps) {
    return (
        <span
            className={clsx(
                'inline-flex max-w-max items-center rounded-full px-3 py-1 text-xs font-extrabold',
                type
                    ? ['text-white shadow-md', CHIP_COLORS[type]]
                    : 'bg-surface text-foreground',
                className,
            )}
        >
            {label}
        </span>
    );
}
