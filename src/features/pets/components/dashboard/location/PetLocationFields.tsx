'use client';

import { Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { LuMap, LuMapPinCheck, LuX } from 'react-icons/lu';
import type { Pet } from '@/types/pets';
import { usePetLocation } from './hooks/usePetLocation';
import PetLocationModal from './PetLocationModal';

type PetLocationFieldsProps = {
    initialData?: Pick<Pet, 'latitude' | 'longitude' | 'city' | 'address'>;
    listingType: string | null;
};

// City, address, and an optional map point chosen in a modal.
// Not rendered for shelter pets: they live at the shelter's address.
export default function PetLocationFields({
    initialData,
    listingType,
}: PetLocationFieldsProps) {
    const t = useTranslations('dashboard.myPets.fields');
    const location = usePetLocation(initialData, listingType);

    return (
        <>
            <TextField
                name="city"
                variant="secondary"
                value={location.city}
                onChange={location.setCity}
            >
                <Label>{t('city')}</Label>
                <Input placeholder={t('city')} />
                <FieldError />
            </TextField>
            <TextField
                name="address"
                variant="secondary"
                value={location.address}
                onChange={location.setAddress}
            >
                <Label>{t('address')}</Label>
                <Input placeholder={t('address')} />
                <FieldError />
            </TextField>
            {location.hasMap && (
                <div className="grid gap-2">
                    {location.position && (
                        <p className="flex items-center gap-2 text-sm font-medium">
                            <LuMapPinCheck
                                aria-hidden
                                className="text-accent text-lg shrink-0"
                            />
                            {t('mapSelected')}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onPress={location.modal.open}
                        >
                            <LuMap aria-hidden />
                            {location.position
                                ? t('mapChange')
                                : t('mapButton')}
                        </Button>
                        {location.position && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onPress={location.clear}
                            >
                                <LuX aria-hidden />
                                {t('mapClear')}
                            </Button>
                        )}
                    </div>
                    {location.position && (
                        <>
                            <input
                                type="hidden"
                                name="latitude"
                                value={location.position[0]}
                            />
                            <input
                                type="hidden"
                                name="longitude"
                                value={location.position[1]}
                            />
                        </>
                    )}
                    <PetLocationModal {...location.modal} />
                </div>
            )}
        </>
    );
}
