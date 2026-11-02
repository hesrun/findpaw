import { buttonVariants, Link } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@shared/lib/supabase/auth';
import getProfile from '@shared/lib/supabase/profile';
import HeaderUserMenu from './HeaderUserMenu';

export default async function HeaderAuth() {
    const t = await getTranslations('auth');
    const { user } = await getCurrentUser();

    if (user) {
        const profile = await getProfile();
        const email = user.email ?? '';

        return (
            <HeaderUserMenu
                name={profile?.full_name || email}
                email={email}
                avatarUrl={profile?.avatar_url ?? null}
                role={profile?.role ?? 'user'}
            />
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/signin"
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
            >
                {t('btns.sign')}
            </Link>
            <Link href="/signup" className={buttonVariants({ size: 'sm' })}>
                {t('btns.signup')}
            </Link>
        </div>
    );
}
