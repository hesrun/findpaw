'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from '@heroui/react';
import { requestPasswordReset } from '@features/auth/actions/actions';

export function useForgotPasswordForm() {
    const t = useTranslations('auth');
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();
    const [isSent, setIsSent] = useState(false);

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set('locale', locale);

        startTransition(async () => {
            const result = await requestPasswordReset(formData);

            if (result.error) {
                toast.danger(t(`errors.${result.error}`));
                return;
            }

            setIsSent(true);
        });
    }

    return { handleSubmit, isPending, isSent };
}
