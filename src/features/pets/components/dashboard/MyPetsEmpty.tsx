import { buttonVariants } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@shared/constants/routes';
import { EmptyState } from '@UI/EmptyState';

export default async function MyPetsEmpty() {
    const t = await getTranslations('dashboard.myPets');
    return (
        <EmptyState
            title={t('emptyState.title')}
            action={
                <Link
                    href={ROUTES.dashboard.addPet}
                    className={buttonVariants()}
                >
                    {t('emptyState.btn')}
                </Link>
            }
        />
    );
}
