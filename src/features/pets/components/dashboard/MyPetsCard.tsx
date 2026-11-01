import { Avatar, Card } from '@heroui/react';
import clsx from 'clsx';
import { TbCurrencyKroneCzech, TbHomeShield } from 'react-icons/tb';
import MyPetActionsDropdown from './MyPetActionsDropdown';
import { FaLocationDot } from 'react-icons/fa6';
import { useLocale, useTranslations } from 'next-intl';
import type { Enums } from '@supabase/database.types';
import type { PetWithShelter } from '@/types/pets';
import SpeciesChip from '@UI/SpeciesChip';
import ListingChip from '@UI/ListingChips';
import { formatDate } from '@shared/helpers/dateFormat';
import PetPlaceholder from '@UI/PetPlaceholder';

// Soft background + dark text pairs (Soft Playful status palette).
const STATUS_CLASSES = {
    active: 'bg-[#dcf3e8] text-[#11643f]',
    reserved: 'bg-[#ffe6cc] text-[#8a3b0c]',
    hidden: 'bg-[#eeeaf5] text-[#5b5470]',
    closed: 'bg-[#ffe0e3] text-[#9f1239]',
} satisfies Record<Enums<'pet_status'>, string>;

export default function MyPetsCard({
    pet,
    setSelectedPet,
    setIsModalOpen,
}: {
    pet: PetWithShelter;
    setSelectedPet: (pet: PetWithShelter) => void;
    setIsModalOpen: (open: boolean) => void;
}) {
    const t = useTranslations('dashboard.myPets');
    const tSpecies = useTranslations('pets.species');
    const tListingType = useTranslations('pets.listingType');
    const tReason = useTranslations('pets.closeReason');
    const locale = useLocale() as 'en' | 'cs';

    const handleCardClick = () => {
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    return (
        <Card
            key={pet.id}
            onClick={handleCardClick}
            className="cursor-pointer rounded-[24px] shadow-my ring-1 ring-border hover:ring-accent/40 transition-shadow"
        >
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                <Avatar size="lg">
                    {pet.image_url?.length ? (
                        <Avatar.Image
                            alt={pet.name ?? 'Pet Image'}
                            src={pet.image_url[0]}
                        />
                    ) : (
                        <Avatar.Fallback className="overflow-hidden p-0">
                            <PetPlaceholder species={pet.species} round />
                        </Avatar.Fallback>
                    )}
                </Avatar>
                <div className="font-display font-extrabold text-lg">
                    {pet.name}
                </div>
                <div className="flex items-center gap-4">
                    <ListingChip
                        label={tListingType(pet.listing_type)}
                        type={pet.listing_type}
                    />
                    {pet.listing_type === 'sale' && (
                        <div className="flex items-center font-medium text-teal-600">
                            {pet.price ?? 'N/A'}
                            <TbCurrencyKroneCzech className="inline mr-1 text-xl" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <SpeciesChip
                        label={tSpecies(pet.species)}
                        type={pet.species}
                    />
                    <div className="text-sm font-medium text-muted">
                        {pet.age_months ?? 'N/A'} {t('fields.age')}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {pet.shelter ? (
                        <>
                            <TbHomeShield className="text-green-500 text-xl" />
                            <span className="text-sm font-medium leading-snug">
                                {`"${pet.shelter.name}", ${pet.shelter.city}`}
                                {pet.shelter.address &&
                                    `, ${pet.shelter.address}`}
                            </span>
                        </>
                    ) : (
                        <>
                            <FaLocationDot className="text-green-500 text-xl" />
                            <span className="text-sm font-medium leading-snug">
                                {pet.city}
                                {pet.address && `, ${pet.address}`}
                            </span>
                        </>
                    )}
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                    <span
                        className={clsx(
                            'rounded-full px-3 py-1 text-xs font-extrabold',
                            STATUS_CLASSES[pet.status],
                        )}
                    >
                        {t(`status.${pet.status}`)}
                    </span>
                    {pet.status === 'closed' && pet.close_reason && (
                        <span className="text-xs text-muted text-right">
                            {tReason(pet.close_reason)}
                            {pet.closed_at &&
                                ` · ${formatDate(pet.closed_at, { locale, format: 'short' })}`}
                        </span>
                    )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <MyPetActionsDropdown pet={pet} />
                </div>
            </div>
        </Card>
    );
}
