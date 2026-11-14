'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from '@heroui/react';
import { requestPasswordReset } from '@features/auth/actions/actions';
import { useCaptcha } from '@shared/hooks/useCaptcha';

export function useForgotPasswordForm() {
    const t = useTranslations('auth');
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();
    const [isSent, setIsSent] = useState(false);
    const { captchaRef, resetCaptcha } = useCaptcha();

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set('locale', locale);

        startTransition(async () => {
            const result = await requestPasswordReset(formData);
            resetCaptcha();

            if (result.error) {
                toast.danger(t(`errors.${result.error}`));
                return;
            }

            setIsSent(true);
        });
    }

    return { handleSubmit, isPending, isSent, captchaRef };
}
