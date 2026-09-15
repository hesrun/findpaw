import { Chip } from '@heroui/react';
import { Enums } from '@supabase/database.types';
import clsx from 'clsx';

export default function SpeciesChip({
    label,
    type,
}: {
    label: string;
    type?: Enums<'pet_species'>;
}) {
    const styles = {
        dog: 'bg-yellow-500',
        cat: 'bg-purple-500',
        bird: 'bg-blue-500',
        fish: 'bg-teal-500',
        rodent: 'bg-pink-500',
        ferret: 'bg-indigo-500',
        rabbit: 'bg-orange-500',
        reptile: 'bg-green-500',
        horse: 'bg-red-500',
        other: 'bg-gray-500',
    };

    return (
        <Chip className={clsx('max-w-max', type && styles[type])}>
            <Chip.Label className="uppercase text-white">{label}</Chip.Label>
        </Chip>
    );
}
