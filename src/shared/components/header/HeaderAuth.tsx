import { Button } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { supabaseServer } from '@shared/lib/supabase/server';
import SignOutButton from './SignOutButton';

export default async function HeaderAuth() {
    const t = await getTranslations('auth');
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <SignOutButton label={t('btns.signOut')} />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link href="/signin">
                <Button size="sm" variant="secondary">
                    {t('btns.sign')}
                </Button>
            </Link>
            <Link href="/signup">
                <Button size="sm">{t('btns.signup')}</Button>
            </Link>
        </div>
    );
}
