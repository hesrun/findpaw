'use client';

import { useTranslations } from 'next-intl';
import { Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { LuUser } from 'react-icons/lu';
import type { Tables } from '@supabase/database.types';
import DashboardCard from '@shared/components/UI/DashboardCard';
import { FileUploader } from '@shared/components/UI/uploader/FileUploader';
import { useAuthFieldValidation } from '@features/auth/hooks/useAuthFieldValidation';
import {
    AVATAR_MAX_FILES,
    PROFILE_NAME_MAX_LENGTH,
    PROFILE_PHONE_MAX_LENGTH,
} from '@features/account/constants';
import { useProfileForm } from './hooks/useProfileForm';

type ProfileFormProps = {
    profile: Tables<'profiles'>;
    email: string;
};

export default function ProfileForm({ profile, email }: ProfileFormProps) {
    const t = useTranslations('dashboard.settings');
    const { handleSubmit, isPending, uploaderRef } = useProfileForm();
    const { validateUserName } = useAuthFieldValidation();

    return (
        <form onSubmit={handleSubmit}>
            <DashboardCard
                title={t('cardTitles.profile')}
                icon={<LuUser className="text-xl" />}
            >
                <div className="grid gap-6">
                    <FileUploader
                        ref={uploaderRef}
                        folder="avatars"
                        maxFiles={AVATAR_MAX_FILES}
                        currentFiles={
                            profile.avatar_url ? [profile.avatar_url] : null
                        }
                        label={t('fields.avatar')}
                        icon={<LuUser className="w-10 h-10" />}
                        round
                    />
                    <div className="grid gap-4">
                        <TextField
                            isRequired
                            name="full_name"
                            variant="secondary"
                            maxLength={PROFILE_NAME_MAX_LENGTH}
                            defaultValue={profile.full_name ?? ''}
                            validate={validateUserName}
                        >
                            <Label>{t('fields.fullName')}</Label>
                            <Input placeholder={t('fields.fullName')} />
                            <FieldError />
                        </TextField>
                        <TextField
                            isReadOnly
                            variant="secondary"
                            value={email}
                        >
                            <Label>{t('fields.email')}</Label>
                            <Input />
                        </TextField>
                        <TextField
                            name="phone"
                            type="tel"
                            variant="secondary"
                            maxLength={PROFILE_PHONE_MAX_LENGTH}
                            defaultValue={profile.phone ?? ''}
                        >
                            <Label>{t('fields.phone')}</Label>
                            <Input placeholder={t('fields.phone')} />
                            <FieldError />
                        </TextField>
                        <Button
                            type="submit"
                            className="justify-self-end"
                            isPending={isPending}
                        >
                            {t('btns.saveProfile')}
                        </Button>
                    </div>
                </div>
            </DashboardCard>
        </form>
    );
}
