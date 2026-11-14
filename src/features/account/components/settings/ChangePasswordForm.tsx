'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@heroui/react';
import { LuLock } from 'react-icons/lu';
import DashboardCard from '@shared/components/UI/DashboardCard';
import { PasswordField } from '@shared/components/UI/PasswordField';
import { Captcha } from '@shared/components/UI/Captcha';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';
import { useChangePasswordForm } from '@features/account/hooks/useChangePasswordForm';

export default function ChangePasswordForm() {
    const t = useTranslations('dashboard.settings');
    const tAuth = useTranslations('auth');
    const { handleSubmit, isPending, captchaRef } = useChangePasswordForm();
    const { validatePassword } = useAuthFieldValidation();

    return (
        <form onSubmit={handleSubmit}>
            <DashboardCard
                title={t('cardTitles.password')}
                icon={<LuLock />}
            >
                <div className="grid gap-4">
                    <PasswordField
                        isRequired
                        name="currentPassword"
                        autoComplete="current-password"
                        variant="secondary"
                        label={t('fields.currentPassword')}
                    />
                    <PasswordField
                        isRequired
                        name="password"
                        autoComplete="new-password"
                        variant="secondary"
                        validate={validatePassword}
                        label={tAuth('fields.newPassword')}
                    />
                    <PasswordField
                        isRequired
                        name="confirmPassword"
                        autoComplete="new-password"
                        variant="secondary"
                        label={tAuth('fields.confirmPassword')}
                    />
                    <Captcha ref={captchaRef} />
                    <Button
                        type="submit"
                        className="justify-self-end"
                        isPending={isPending}
                    >
                        {tAuth('btns.updatePassword')}
                    </Button>
                </div>
            </DashboardCard>
        </form>
    );
}
