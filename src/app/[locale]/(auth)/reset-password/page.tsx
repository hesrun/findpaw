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
import { useResetPasswordForm } from '@features/auth/hooks/useResetPasswordForm';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';

export default function ResetPassword() {
    const t = useTranslations('auth');
    const { handleSubmit, isPending } = useResetPasswordForm();
    const { validatePassword } = useAuthFieldValidation();

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6 mt-[10%]"
        >
            <Card className="p-6 grid gap-6">
                <h1 className="text-3xl font-display font-extrabold">
                    {t('titles.resetPassword')}
                </h1>
                <div className="grid gap-4">
                    <TextField
                        isRequired
                        name="password"
                        type="password"
                        validate={validatePassword}
                    >
                        <Label>{t('fields.newPassword')}</Label>
                        <Input placeholder={t('fields.newPassword')} />
                        <FieldError />
                    </TextField>
                    <TextField
                        isRequired
                        name="confirmPassword"
                        type="password"
                    >
                        <Label>{t('fields.confirmPassword')}</Label>
                        <Input placeholder={t('fields.confirmPassword')} />
                        <FieldError />
                    </TextField>
                </div>
                <Button fullWidth type="submit" isPending={isPending}>
                    {t('btns.updatePassword')}
                </Button>
            </Card>
        </form>
    );
}
