'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { toast } from '@heroui/react';
import { useRouter } from '@/i18n/navigation';
import { signUp } from '@features/auth/actions/actions';
import { ROUTES } from '@shared/constants/routes';
import { useCaptcha } from '@shared/hooks/useCaptcha';

export function useSignUpForm() {
    const t = useTranslations('auth');
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { captchaRef, resetCaptcha } = useCaptcha();

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set('locale', locale);

        startTransition(async () => {
            const result = await signUp(formData);
            resetCaptcha();

            if (result.error) {
                toast.danger(t(`errors.${result.error}`));
                return;
            }

            toast.success(t('notifications.signUpSuccess'));
            router.push(ROUTES.auth.signIn);
        });
    }

    return { handleSubmit, isPending, captchaRef };
}
