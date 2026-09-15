import { Chip } from '@heroui/react';
import { Enums } from '@supabase/database.types';
import clsx from 'clsx';

interface ListingChipProps {
    label: string;
    type?: Enums<'pet_listing_type'>;
}

export default function ListingChip({
    label,
    type,
}: ListingChipProps & React.HTMLAttributes<HTMLDivElement>) {
    const styles: Record<Enums<'pet_listing_type'>, string> = {
        sale: 'bg-green-500',
        adoption: 'bg-blue-500',
        lost: 'bg-red-500',
        found: 'bg-yellow-500',
    };

    return (
        <Chip className={clsx('max-w-max', type && styles[type])}>
            <Chip.Label className="uppercase text-white">{label}</Chip.Label>
        </Chip>
    );
}
