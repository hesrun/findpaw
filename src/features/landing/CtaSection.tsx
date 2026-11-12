import { buttonVariants } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import CtaBand from '@UI/CtaBand';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@shared/constants/routes';

export default async function CtaSection() {
    const t = await getTranslations('HomePage.cta');

    return (
        <div className="container mt-14 mb-16">
            <CtaBand title={t('title')} text={t('text')}>
                <Link href={ROUTES.pets} className={buttonVariants({ size: 'lg' })}>
                    {t('browse')}
                </Link>
                <Link
                    href={ROUTES.dashboard.addPet}
                    className={buttonVariants({
                        size: 'lg',
                        variant: 'outline',
                    })}
                >
                    {t('add')}
                </Link>
            </CtaBand>
        </div>
    );
}
