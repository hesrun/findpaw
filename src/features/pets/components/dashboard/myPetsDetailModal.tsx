import { Button, Modal } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import {
    LuBadgeAlert,
    LuCamera,
    LuCross,
    LuInfo,
    LuMapPin,
} from 'react-icons/lu';
import DashboardCard from '@shared/components/UI/DashboardCard';
import { TbHomeShield, TbScissors, TbVaccine } from 'react-icons/tb';
import { formatDate } from '@shared/helpers/dateFormat';
import ImageCap from '@shared/components/UI/ImageCap';
import type { PetWithShelter } from '../../../../types/pets';

function ListItem({
    label,
    value,
}: {
    label: string;
    value: string | number | null;
}) {
    return (
        <li className="border-t border-border flex items-baseline  justify-between py-2">
            <span className="whitespace-nowrap">{label}</span>
            <b className="text-right text-accent font-bold font-heading first-letter:uppercase">
                {value ?? 'N/A'}
            </b>
        </li>
    );
}

export default function MyPetsDetailModal({
    isModalOpen,
    setIsModalOpen,
    selectedPet,
}: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    selectedPet: PetWithShelter;
}) {
    const locale = useLocale() as 'en' | 'cs';

    const pets = useTranslations('dashboard.myPets');
    const global = useTranslations('global');
    const modalTitles = useTranslations('modalLabels');

    console.log(locale);

    return (
        <Modal.Backdrop isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Container scroll="outside">
                <Modal.Dialog
                    aria-label={modalTitles('petDetails')}
                    className="sm:max-w-[800px] bg-background"
                >
                    <Modal.CloseTrigger className="z-10" />
                    <Modal.Body>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-12 gap-4 items-start">
                                <DashboardCard
                                    className="col-span-12 sm:col-span-8"
                                    title={pets('cardTitles.photo')}
                                    icon={
                                        <LuCamera className="text-accent text-xl" />
                                    }
                                >
                                    {selectedPet.image_url ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedPet.image_url.map(
                                                (
                                                    url: string,
                                                    index: number,
                                                ) => (
                                                    <Image
                                                        key={index}
                                                        width={600}
                                                        height={400}
                                                        src={url}
                                                        alt={
                                                            selectedPet.name ??
                                                            'Pet Image'
                                                        }
                                                        className={`w-full object-cover rounded-md ${index === 0 ? 'sm:col-span-3' : 'aspect-square'}`}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <ImageCap />
                                    )}
                                </DashboardCard>
                                <div className="col-span-12 sm:col-span-4 grid gap-4">
                                    <DashboardCard
                                        title={pets('cardTitles.general')}
                                        icon={
                                            <LuInfo className="text-accent text-xl" />
                                        }
                                    >
                                        <ul>
                                            <ListItem
                                                label={pets('fields.petName')}
                                                value={selectedPet.name}
                                            />
                                            <ListItem
                                                label={pets('fields.species')}
                                                value={selectedPet.species}
                                            />
                                            <ListItem
                                                label={pets('fields.sex')}
                                                value={selectedPet.sex}
                                            />
                                            <ListItem
                                                label={pets('fields.age')}
                                                value={selectedPet.age_months}
                                            />
                                            <ListItem
                                                label={pets('fields.breed')}
                                                value={selectedPet.breed}
                                            />
                                            <ListItem
                                                label={pets(
                                                    'fields.listingType',
                                                )}
                                                value={selectedPet.listing_type}
                                            />
                                            {selectedPet.listing_type ===
                                                'sale' && (
                                                <ListItem
                                                    label={pets('fields.price')}
                                                    value={selectedPet.price}
                                                />
                                            )}
                                            <ListItem
                                                label={global('createdAt')}
                                                value={
                                                    selectedPet.created_at &&
                                                    formatDate(
                                                        selectedPet.created_at,
                                                        {
                                                            locale: locale,
                                                            format: 'medium',
                                                        },
                                                    )
                                                }
                                            />
                                            <ListItem
                                                label={global('updatedAt')}
                                                value={
                                                    selectedPet.updated_at &&
                                                    formatDate(
                                                        selectedPet.updated_at,
                                                        {
                                                            locale: locale,
                                                            format: 'medium',
                                                        },
                                                    )
                                                }
                                            />
                                        </ul>
                                    </DashboardCard>
                                    <DashboardCard
                                        title={pets('cardTitles.location')}
                                        icon={
                                            <LuMapPin className="text-accent text-xl" />
                                        }
                                    >
                                        <div>
                                            {selectedPet.shelter && (
                                                <div>
                                                    <span className="text-muted">
                                                        {pets('fields.shelter')}
                                                        :{' '}
                                                    </span>
                                                    <b className="text-accent font-bold">
                                                        {
                                                            selectedPet.shelter
                                                                ?.name
                                                        }
                                                    </b>
                                                </div>
                                            )}
                                            <b className="text-accent font-bold font-heading first-letter:uppercase">
                                                {selectedPet.shelter
                                                    ? `${selectedPet.shelter.city}, ${selectedPet.shelter.address}`
                                                    : `${selectedPet.city}, ${selectedPet.address}`}
                                            </b>
                                        </div>
                                    </DashboardCard>
                                </div>
                            </div>
                            <DashboardCard
                                title={pets('fields.description')}
                                icon={
                                    <LuInfo className="text-accent text-xl" />
                                }
                            >
                                {selectedPet.description}
                            </DashboardCard>
                            <DashboardCard
                                title={pets('cardTitles.checkList')}
                                icon={
                                    <LuCross className="text-accent text-xl" />
                                }
                            >
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-green-500 text-white rounded-2xl w-10 h-10 flex items-center justify-center">
                                            <TbVaccine className="text-xl" />
                                        </div>
                                        <div className="grid">
                                            <span>
                                                {pets('fields.vaccinated')}
                                            </span>
                                            <b className="text-accent">
                                                {selectedPet.is_vaccinated
                                                    ? global('yes')
                                                    : global('no')}
                                            </b>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-500 text-white rounded-2xl w-10 h-10 flex items-center justify-center">
                                            <TbScissors className="text-xl" />
                                        </div>
                                        <div className="grid">
                                            <span>
                                                {pets('fields.sterilized')}
                                            </span>
                                            <b className="text-accent">
                                                {selectedPet.is_sterilized
                                                    ? global('yes')
                                                    : global('no')}
                                            </b>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-red-500 text-white rounded-2xl w-10 h-10 flex items-center justify-center">
                                            <LuBadgeAlert className="text-xl" />
                                        </div>
                                        <div className="grid">
                                            <span>
                                                {pets('fields.specialNeeds')}
                                            </span>
                                            <b className="text-accent">
                                                {selectedPet.is_special_needs
                                                    ? global('yes')
                                                    : global('no')}
                                            </b>
                                        </div>
                                    </div>
                                </div>
                            </DashboardCard>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            {global('close')}
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}
