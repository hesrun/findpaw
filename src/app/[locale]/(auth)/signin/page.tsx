'use client';

import { useTranslations } from 'next-intl';
import { PasswordField } from '@shared/components/UI/PasswordField';
import {
    Button,
    Card,
    FieldError,
    Input,
    Label,
    TextField,
} from '@heroui/react';
import { Link } from '@/i18n/navigation';
import { useSignInForm } from '@features/auth/hooks/useSignInForm';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';
import { ROUTES } from '@shared/constants/routes';
import { Captcha } from '@shared/components/UI/Captcha';

export default function SignIn() {
    const t = useTranslations('auth');
    const { handleSubmit, isPending, captchaRef } = useSignInForm();
    const { validateEmail, validatePassword } = useAuthFieldValidation();

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6"
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
                    <PasswordField
                        autoComplete="current-password"
                        isRequired
                        name="password"
                        validate={validatePassword}
                        label={t('fields.password')}
                    />
                    <Link
                        href={ROUTES.auth.forgotPassword}
                        className="justify-self-end text-sm text-accent hover:underline"
                    >
                        {t('links.forgotPassword')}
                    </Link>
                </div>
                <Captcha ref={captchaRef} />
                <Button fullWidth type="submit" isPending={isPending}>
                    {t('btns.sign')}
                </Button>
                <p className="text-sm text-center text-muted">
                    {t('links.noAccount')}{' '}
                    <Link
                        href={ROUTES.auth.signUp}
                        className="font-bold text-accent hover:underline"
                    >
                        {t('btns.signup')}
                    </Link>
                </p>
            </Card>
        </form>
    );
}
