'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from '@heroui/react';
import { changePassword } from '@features/auth/actions/actions';
import { useCaptcha } from '@shared/hooks/useCaptcha';

export function useChangePasswordForm() {
    const t = useTranslations('auth');
    const [isPending, startTransition] = useTransition();
    const { captchaRef, resetCaptcha } = useCaptcha();

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            const result = await changePassword(formData);
            resetCaptcha();

            if (result.error) {
                toast.danger(t(`errors.${result.error}`));
                return;
            }

            toast.success(t('notifications.passwordUpdated'));
            form.reset();
        });
    }

    return { handleSubmit, isPending, captchaRef };
}
