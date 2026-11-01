import { Enums } from '@supabase/database.types';
import PetPlaceholder from './PetPlaceholder';

// Soft pill with the species face, matching the listing chips.
export default function SpeciesChip({
    label,
    type,
}: {
    label: string;
    type?: Enums<'pet_species'>;
}) {
    return (
        <span className="inline-flex max-w-max items-center gap-1.5 rounded-full bg-soft py-0.5 pr-3 pl-0.5 text-xs font-extrabold text-muted">
            {type && (
                <span className="size-5 overflow-hidden rounded-full">
                    <PetPlaceholder species={type} round />
                </span>
            )}
            {label}
        </span>
    );
}
