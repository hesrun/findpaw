import { buttonVariants, Link } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@shared/lib/supabase/auth';
import SignOutButton from './SignOutButton';

export default async function HeaderAuth() {
    const t = await getTranslations('auth');
    const { user } = await getCurrentUser();

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <SignOutButton label={t('btns.signOut')} />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/signin"
                className={buttonVariants({ size: 'sm', variant: 'secondary' })}
            >
                {t('btns.sign')}
            </Link>
            <Link href="/signup" className={buttonVariants({ size: 'sm' })}>
                {t('btns.signup')}
            </Link>
        </div>
    );
}
