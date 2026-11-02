'use client';

import {
    Button,
    Card,
    FieldError,
    Input,
    Label,
    Radio,
    RadioGroup,
    TextField,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { TbHomeShield } from 'react-icons/tb';
import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import {
    AUTH_ROUTES,
    DEFAULT_SIGN_UP_ROLE,
    SIGN_UP_ROLES,
    type SignUpRole,
} from '@features/auth/constants';
import { useSignUpForm } from '@features/auth/hooks/useSignUpForm';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';

// Keyed by the database role enum: adding or renaming a sign-up role
// fails type checking until it has an icon here.
const roleIcons = {
    user: <FaRegUserCircle />,
    shelter: <TbHomeShield />,
} satisfies Record<SignUpRole, ReactNode>;

export default function SignUp() {
    const roles = useTranslations('roles');
    const t = useTranslations('auth');
    const { handleSubmit, isPending } = useSignUpForm();
    const { validateEmail, validatePassword, validateUserName } =
        useAuthFieldValidation();

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6 mt-[8%]"
        >
            <Card className="p-6 grid gap-6">
                <h1 className="text-3xl font-display font-extrabold">
                    {t('titles.signup')}
                </h1>
                <div className="grid gap-4">
                    <RadioGroup
                        defaultValue={DEFAULT_SIGN_UP_ROLE}
                        name="role"
                        variant="secondary"
                    >
                        <Label>{t('fields.role')}</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {SIGN_UP_ROLES.map((role) => (
                                <Radio
                                    key={role}
                                    value={role}
                                    className={clsx(
                                        'group relative flex-col gap-4 rounded-xl border bg-surface px-4 py-4 mt-1 border-border transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10',
                                        'data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10',
                                    )}
                                >
                                    <Radio.Control className="absolute top-3.5 right-4 size-5">
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content className="flex flex-col gap-4">
                                        <span className="text-2xl text-accent">
                                            {roleIcons[role]}
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <Label>{roles(role)}</Label>
                                        </div>
                                    </Radio.Content>
                                </Radio>
                            ))}
                        </div>
                    </RadioGroup>
                    <TextField
                        isRequired
                        name="userName"
                        type="text"
                        variant="secondary"
                        validate={validateUserName}
                    >
                        <Label>{t('fields.userName')}</Label>
                        <Input placeholder={t('fields.userName')} />
                        <FieldError />
                    </TextField>
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        variant="secondary"
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
                        variant="secondary"
                        validate={validatePassword}
                    >
                        <Label>{t('fields.password')}</Label>
                        <Input placeholder={t('fields.password')} />
                        <FieldError />
                    </TextField>
                </div>
                <Button fullWidth type="submit" isPending={isPending}>
                    {t('btns.signup')}
                </Button>
                <p className="text-sm text-center text-muted">
                    {t('links.haveAccount')}{' '}
                    <Link
                        href={AUTH_ROUTES.signIn}
                        className="font-bold text-accent hover:underline"
                    >
                        {t('btns.sign')}
                    </Link>
                </p>
            </Card>
        </form>
    );
}
