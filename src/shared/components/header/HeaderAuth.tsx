import { buttonVariants } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { LuUserRound } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
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

    // Mobile: one icon (sign-up is linked from the sign-in page).
    // Desktop (md+): both text buttons.
    return (
        <>
            <Link
                href="/signin"
                aria-label={t('btns.sign')}
                title={t('btns.sign')}
                className={buttonVariants({
                    isIconOnly: true,
                    variant: 'outline',
                    className: 'rounded-full md:hidden',
                })}
            >
                <LuUserRound className="text-xl" aria-hidden />
            </Link>
            <div className="hidden md:flex items-center gap-2">
                <Link
                    href="/signin"
                    className={buttonVariants({
                        size: 'sm',
                        variant: 'outline',
                    })}
                >
                    {t('btns.sign')}
                </Link>
                <Link
                    href="/signup"
                    className={buttonVariants({ size: 'sm' })}
                >
                    {t('btns.signup')}
                </Link>
            </div>
        </>
    );
}
