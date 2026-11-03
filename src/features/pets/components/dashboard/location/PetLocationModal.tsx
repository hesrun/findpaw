'use client';

import { Button, Modal } from '@heroui/react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { LuLocateFixed } from 'react-icons/lu';

const PetLocationPickerMap = dynamic(() => import('./PetLocationPickerMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[60vh] rounded-media bg-soft animate-pulse" />
    ),
});

type PetLocationModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    draft: [number, number] | null;
    pick: (lat: number, lng: number) => void;
    confirm: () => void;
    locate: () => void;
    isLocating: boolean;
};

// Large map for choosing the point. Edits a draft: Cancel keeps the point
// the form already has.
export default function PetLocationModal({
    isOpen,
    setIsOpen,
    title,
    draft,
    pick,
    confirm,
    locate,
    isLocating,
}: PetLocationModalProps) {
    const t = useTranslations('dashboard.myPets');

    return (
        <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
            <Modal.Container>
                <Modal.Dialog aria-label={title} className="sm:max-w-4xl">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading className="font-display font-extrabold text-xl">
                            {title}
                        </Modal.Heading>
                    </Modal.Header>
                    <Modal.Body className="grid gap-3">
                        <p className="text-muted text-sm">
                            {t('fields.mapHint')}
                        </p>
                        <PetLocationPickerMap position={draft} onPick={pick} />
                    </Modal.Body>
                    <Modal.Footer className="flex-wrap">
                        <Button
                            variant="ghost"
                            isPending={isLocating}
                            onPress={locate}
                            className="mr-auto"
                        >
                            <LuLocateFixed aria-hidden />
                            {t('fields.mapUseMyLocation')}
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={() => setIsOpen(false)}
                        >
                            {t('buttons.cancel')}
                        </Button>
                        <Button isDisabled={!draft} onPress={confirm}>
                            {t('fields.mapConfirm')}
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}
