'use client';

import { useTranslations } from 'next-intl';
import {
    Button,
    Card,
    FieldError,
    Input,
    Label,
    TextField,
} from '@heroui/react';
import { Link } from '@/i18n/navigation';
import { useForgotPasswordForm } from '@features/auth/hooks/useForgotPasswordForm';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';
import { ROUTES } from '@shared/constants/routes';

export default function ForgotPasswordForm({
    isLinkExpired,
}: {
    isLinkExpired: boolean;
}) {
    const t = useTranslations('auth');
    const { handleSubmit, isPending, isSent } = useForgotPasswordForm();
    const { validateEmail } = useAuthFieldValidation();

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6"
        >
            <Card className="p-6 grid gap-6">
                <div className="grid gap-2">
                    <h1 className="text-3xl font-display font-extrabold">
                        {t('titles.forgotPassword')}
                    </h1>
                    <p className="text-muted">{t('hints.forgotPassword')}</p>
                </div>
                {isLinkExpired && (
                    <p role="alert" className="text-danger">
                        {t('errors.linkExpired')}
                    </p>
                )}
                {isSent ? (
                    <p role="status">{t('notifications.resetEmailSent')}</p>
                ) : (
                    <>
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            validate={validateEmail}
                        >
                            <Label>{t('fields.email')}</Label>
                            <Input placeholder={t('fields.email')} />
                            <FieldError />
                        </TextField>
                        <Button fullWidth type="submit" isPending={isPending}>
                            {t('btns.sendResetLink')}
                        </Button>
                    </>
                )}
                <Link
                    href={ROUTES.auth.signIn}
                    className="text-sm text-accent hover:underline"
                >
                    {t('links.backToSignIn')}
                </Link>
            </Card>
        </form>
    );
}
