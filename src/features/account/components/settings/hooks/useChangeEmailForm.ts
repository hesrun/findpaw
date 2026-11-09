'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from '@heroui/react';
import { changeEmail } from '@features/auth/actions/actions';

export function useChangeEmailForm() {
    const t = useTranslations('auth');
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.set('locale', locale);

        startTransition(async () => {
            const result = await changeEmail(formData);

            if (result.error) {
                toast.danger(t(`errors.${result.error}`));
                return;
            }

            toast.success(t('notifications.emailChangeSent'));
            form.reset();
        });
    }

    return { handleSubmit, isPending };
}
