import { Avatar, Card, Chip } from '@heroui/react';
import { TbCurrencyKroneCzech, TbHomeShield } from 'react-icons/tb';
import { SPECIES } from '../../constants';
import MyPetActionsDropdown from './MyPetActionsDropdown';
import { FaLocationDot } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';
import { PetWithShelter } from '@types/pets';

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
                    <Chip variant="primary" className="bg-accent text-white">
                        <Chip.Label className="flex items-center gap-1 uppercase">
                            {t(`type.${pet.listing_type}`)}
                        </Chip.Label>
                    </Chip>
                    {pet.listing_type === 'sale' && (
                        <div className="flex items-center font-medium text-teal-600">
                            {pet.price ?? 'N/A'}
                            <TbCurrencyKroneCzech className="inline mr-1 text-xl" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <Chip
                        variant="primary"
                        className="bg-accent text-white max-w-max"
                    >
                        <Chip.Label className="flex items-center gap-1 uppercase">
                            {
                                SPECIES.find((type) => type.id === pet.species)
                                    ?.icon
                            }
                            {t(`species.${pet.species}`)}
                        </Chip.Label>
                    </Chip>
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
                <Chip
                    className="max-w-max ml-auto"
                    variant="primary"
                    color={pet.status === 'active' ? 'success' : 'danger'}
                >
                    <Chip.Label className="uppercase text-white">
                        {t(`status.${pet.status}`)}
                    </Chip.Label>
                </Chip>
                <div onClick={(e) => e.stopPropagation()}>
                    <MyPetActionsDropdown petId={pet.id} />
                </div>
            </div>
        </Card>
    );
}
