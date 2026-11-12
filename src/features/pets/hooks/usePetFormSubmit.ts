'use client';

import { toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRef, useTransition, type SubmitEvent } from 'react';
import type { FileUploaderRef } from '@shared/components/UI/uploader/FileUploader';
import { uploadToFormData } from '@shared/components/UI/uploader/uploadToFormData';
import { createPet, updatePet } from '@features/pets/actions';
import { ROUTES } from '@shared/constants/routes';

// Uploads the new photos, then creates or updates the pet and reports the result.
export function usePetFormSubmit(petId: string | undefined) {
    const t = useTranslations('dashboard.myPets.notifications');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const fileUploaderRef = useRef<FileUploaderRef>(null);
    const isEditing = !!petId;

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            await uploadToFormData(
                fileUploaderRef.current,
                formData,
                'image_url',
            );
            const response = petId
                ? await updatePet(petId, formData)
                : await createPet(formData);

            if (response.success) {
                toast.success(
                    isEditing ? t('updateSuccess') : t('createSuccess'),
                );
                router.push(ROUTES.dashboard.pets);
            } else {
                toast.danger(isEditing ? t('updateError') : t('createError'));
            }
        });
    }

    return {
        handleSubmit,
        isPending,
        fileUploaderRef,
        goBack: () => router.back(),
    };
}
