import { Avatar, Card, Chip } from '@heroui/react';
import type { ComponentProps } from 'react';
import { TbCurrencyKroneCzech, TbHomeShield } from 'react-icons/tb';
import MyPetActionsDropdown from './MyPetActionsDropdown';
import { FaLocationDot } from 'react-icons/fa6';
import { useLocale, useTranslations } from 'next-intl';
import type { Enums } from '@supabase/database.types';
import type { PetWithShelter } from '@/types/pets';
import SpeciesChip from '@UI/SpeciesChip';
import ListingChip from '@UI/ListingChips';
import { formatDate } from '@shared/helpers/dateFormat';

const STATUS_COLORS = {
    active: 'success',
    reserved: 'warning',
    hidden: 'default',
    closed: 'danger',
} satisfies Record<Enums<'pet_status'>, ComponentProps<typeof Chip>['color']>;

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
            className="cursor-pointer hover:bg-muted/10 transition-colors"
        >
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                <Avatar size="lg">
                    {pet.image_url?.length ? (
                        <Avatar.Image
                            alt={pet.name ?? 'Pet Image'}
                            src={pet.image_url[0]}
                        />
                    ) : (
                        <Avatar.Fallback className="bg-accent text-white">
                            {pet.name ? pet.name[0] : 'P'}
                        </Avatar.Fallback>
                    )}
                </Avatar>
                <div className="text-accent font-medium">{pet.name}</div>
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
                    <Chip
                        className="max-w-max"
                        variant="primary"
                        color={STATUS_COLORS[pet.status]}
                    >
                        <Chip.Label className="uppercase text-white">
                            {t(`status.${pet.status}`)}
                        </Chip.Label>
                    </Chip>
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
