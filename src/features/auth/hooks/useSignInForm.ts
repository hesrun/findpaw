'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from '@heroui/react';
import { useRouter } from '@/i18n/navigation';
import { signIn } from '@features/auth/actions/actions';
import { AUTH_ROUTES } from '@features/auth/constants';

export function useSignInForm() {
    const t = useTranslations('auth');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await signIn(formData);

            if (result.error) {
                toast.danger(t(`errors.${result.error}`));
                return;
            }

            toast.success(t('notifications.signInSuccess'));
            router.push(AUTH_ROUTES.afterSignIn);
        });
    }

    return { handleSubmit, isPending };
}
