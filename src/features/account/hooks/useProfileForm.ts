'use client';

import { useRef, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from '@heroui/react';
import type { FileUploaderRef } from '@shared/components/UI/uploader/FileUploader';
import { uploadToFormData } from '@shared/components/UI/uploader/uploadToFormData';
import { updateProfile } from '@features/account/actions';

export function useProfileForm() {
    const t = useTranslations('dashboard.settings');
    const [isPending, startTransition] = useTransition();
    const uploaderRef = useRef<FileUploaderRef>(null);

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            try {
                await uploadToFormData(
                    uploaderRef.current,
                    formData,
                    'avatar_url',
                );
            } catch {
                return; // the uploader has already shown a toast
            }
            const result = await updateProfile(formData);

            if (result.error) {
                toast.danger(t(`errors.${result.error}`));
                return;
            }

            toast.success(t('notifications.profileUpdated'));
        });
    }

    return { handleSubmit, isPending, uploaderRef };
}
