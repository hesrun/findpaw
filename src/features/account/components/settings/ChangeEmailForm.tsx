'use client';

import { useTranslations } from 'next-intl';
import { Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { LuMail } from 'react-icons/lu';
import DashboardCard from '@shared/components/UI/DashboardCard';
import { PasswordField } from '@shared/components/UI/PasswordField';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';
import { useChangeEmailForm } from './hooks/useChangeEmailForm';

export default function ChangeEmailForm({ email }: { email: string }) {
    const t = useTranslations('dashboard.settings');
    const { handleSubmit, isPending } = useChangeEmailForm();
    const { validateEmail } = useAuthFieldValidation();

    return (
        <form onSubmit={handleSubmit}>
            <DashboardCard
                title={t('cardTitles.email')}
                icon={<LuMail className="text-xl" />}
            >
                <div className="grid gap-4">
                    <p className="text-sm text-muted">
                        {t('hints.email', { email })}
                    </p>
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        autoComplete="email"
                        variant="secondary"
                        validate={validateEmail}
                    >
                        <Label>{t('fields.newEmail')}</Label>
                        <Input placeholder={t('fields.newEmail')} />
                        <FieldError />
                    </TextField>
                    <PasswordField
                        isRequired
                        name="currentPassword"
                        autoComplete="current-password"
                        variant="secondary"
                        label={t('fields.currentPassword')}
                    />
                    <Button
                        type="submit"
                        className="justify-self-end"
                        isPending={isPending}
                    >
                        {t('btns.changeEmail')}
                    </Button>
                </div>
            </DashboardCard>
        </form>
    );
}
