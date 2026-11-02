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
import { AUTH_ROUTES } from '@features/auth/constants';
import { useSignInForm } from '@features/auth/hooks/useSignInForm';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';

export default function SignIn() {
    const t = useTranslations('auth');
    const { handleSubmit, isPending } = useSignInForm();
    const { validateEmail, validatePassword } = useAuthFieldValidation();

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6 mt-[10%]"
        >
            <Card className="p-6 grid gap-6">
                <h1 className="text-3xl font-display font-extrabold">
                    {t('titles.sign')}
                </h1>
                <div className="grid gap-4">
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
                    <TextField
                        isRequired
                        name="password"
                        type="password"
                        validate={validatePassword}
                    >
                        <Label>{t('fields.password')}</Label>
                        <Input placeholder={t('fields.password')} />
                        <FieldError />
                    </TextField>
                    <Link
                        href={AUTH_ROUTES.forgotPassword}
                        className="justify-self-end text-sm text-accent hover:underline"
                    >
                        {t('links.forgotPassword')}
                    </Link>
                </div>
                <Button fullWidth type="submit" isPending={isPending}>
                    {t('btns.sign')}
                </Button>
            </Card>
        </form>
    );
}
