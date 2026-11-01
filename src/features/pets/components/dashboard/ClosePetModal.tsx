'use client';

import { Button, Label, Modal, Radio, RadioGroup } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Enums } from '@supabase/database.types';
import { CLOSE_REASONS_BY_LISTING_TYPE } from '@features/pets/constants';

type CloseReason = Enums<'pet_close_reason'>;

export default function ClosePetModal({
    isOpen,
    onOpenChange,
    listingType,
    isPending,
    onConfirm,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    listingType: Enums<'pet_listing_type'>;
    isPending: boolean;
    onConfirm: (reason: CloseReason) => void;
}) {
    const t = useTranslations('dashboard.myPets');
    const tReason = useTranslations('pets.closeReason');
    const reasons: CloseReason[] = CLOSE_REASONS_BY_LISTING_TYPE[listingType];
    const [reason, setReason] = useState<CloseReason>(reasons[0]);

    return (
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                <Modal.Dialog
                    aria-label={t('closeModal.title')}
                    className="sm:max-w-md"
                >
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading className="font-display font-extrabold text-xl">
                            {t('closeModal.title')}
                        </Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-muted text-sm mb-4">
                            {t('closeModal.description')}
                        </p>
                        <RadioGroup
                            aria-label={t('closeModal.title')}
                            value={reason}
                            onChange={(value) => setReason(value as CloseReason)}
                        >
                            {reasons.map((value) => (
                                <Radio key={value} value={value}>
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content>
                                        <Label>{tReason(value)}</Label>
                                    </Radio.Content>
                                </Radio>
                            ))}
                        </RadioGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onPress={() => onOpenChange(false)}
                        >
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            variant="danger"
                            isPending={isPending}
                            onPress={() => onConfirm(reason)}
                        >
                            {t('buttons.closeListing')}
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}
