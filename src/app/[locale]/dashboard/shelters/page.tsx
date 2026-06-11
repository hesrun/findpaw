import { getTranslations } from 'next-intl/server';
import MyShelters from '@/features/shelters/components/dashboard/MyShelters';

export default async function SheltersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const [{ page }, t] = await Promise.all([
        searchParams,
        getTranslations('dashboard.myShelters'),
    ]);
    const pageNumber = Math.max(1, Number(page) || 1);
    return (
        <>
            <div className="mb-6">
                <h1 className="font-heading font-bold text-accent text-3xl mb-2">
                    {t('titles.title')}
                </h1>
                <p className="text-muted">{t('titles.description')}</p>
            </div>
            <MyShelters page={pageNumber} />
        </>
    );
}
