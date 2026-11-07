'use client';

import { useTranslations } from 'next-intl';
import { PasswordField } from '@shared/components/UI/PasswordField';
import { Button, Card } from '@heroui/react';
import { useResetPasswordForm } from '@features/auth/hooks/useResetPasswordForm';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';

export default function ResetPassword() {
    const t = useTranslations('auth');
    const { handleSubmit, isPending } = useResetPasswordForm();
    const { validatePassword } = useAuthFieldValidation();

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6"
        >
            <Card className="p-6 grid gap-6">
                <h1 className="text-3xl font-display font-extrabold">
                    {t('titles.resetPassword')}
                </h1>
                <div className="grid gap-4">
                    <PasswordField
                        autoComplete="new-password"
                        isRequired
                        name="password"
                        validate={validatePassword}
                        label={t('fields.newPassword')}
                    />
                    <PasswordField
                        autoComplete="new-password"
                        isRequired
                        name="confirmPassword"
                        label={t('fields.confirmPassword')}
                    />
                </div>
                <Button fullWidth type="submit" isPending={isPending}>
                    {t('btns.updatePassword')}
                </Button>
            </Card>
        </form>
    );
}
