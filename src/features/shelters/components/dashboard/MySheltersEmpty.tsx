import { buttonVariants } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@shared/constants/routes';
import { EmptyState } from '@UI/EmptyState';

export default async function MySheltersEmpty() {
    const t = await getTranslations('dashboard.myShelters');
    return (
        <EmptyState
            title={t('emptyState.title')}
            action={
                <Link
                    href={ROUTES.dashboard.addShelter}
                    className={buttonVariants()}
                >
                    {t('emptyState.btn')}
                </Link>
            }
        />
    );
}
