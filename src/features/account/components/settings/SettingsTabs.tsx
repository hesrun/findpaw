import { getTranslations } from 'next-intl/server';
import { Tabs } from '@heroui/react';
import type { Tables } from '@supabase/database.types';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeEmailForm from './ChangeEmailForm';

type SettingsTabsProps = {
    profile: Tables<'profiles'>;
    email: string;
};

export default async function SettingsTabs({ profile, email }: SettingsTabsProps) {
    const t = await getTranslations('dashboard.settings');

    return (
        <Tabs className="grid gap-6 w-full max-w-xl">
            <Tabs.ListContainer>
                <Tabs.List aria-label={t('title')}>
                    <Tabs.Tab id="profile">
                        {t('tabs.profile')}
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="password">
                        {t('tabs.password')}
                        <Tabs.Indicator />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel id="profile" className="grid gap-6">
                <ProfileForm profile={profile} />
                <ChangeEmailForm email={email} />
            </Tabs.Panel>
            <Tabs.Panel id="password">
                <ChangePasswordForm />
            </Tabs.Panel>
        </Tabs>
    );
}
