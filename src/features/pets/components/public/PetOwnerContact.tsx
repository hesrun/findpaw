'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@heroui/react';
import { usePetOwnerContact } from '../../hooks';
import PetContact from './PetContact';

// Author contact of a private listing, revealed on click (see usePetOwnerContact).
export default function PetOwnerContact({ petId }: { petId: string }) {
    const t = useTranslations('petsPage.detail');
    const { contact, isRevealed, isLoading, isError, reveal } =
        usePetOwnerContact(petId);
    const showButton = !contact && !isError;

    return (
        <PetContact
            title={t('contactOwner')}
            name={contact?.full_name}
            phone={contact?.phone}
            email={contact?.email}
        >
            {showButton && (
                <Button
                    className="mt-4"
                    onPress={reveal}
                    isPending={isRevealed && isLoading}
                >
                    {t('showContact')}
                </Button>
            )}
            {isError && (
                <p className="text-sm text-muted mt-2">{t('noContact')}</p>
            )}
        </PetContact>
    );
}
