import { getTranslations } from 'next-intl/server';
import MyShelters from '@/features/shelters/components/dashboard/MyShelters';
import DashboardPageHeader from '@UI/DashboardPageHeader';

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
            <DashboardPageHeader
                title={t('titles.title')}
                description={t('titles.description')}
            />
            <MyShelters page={pageNumber} />
        </>
    );
}
