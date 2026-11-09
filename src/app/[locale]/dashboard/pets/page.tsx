import MyPets from '@/features/pets/components/dashboard/MyPets';
import { getTranslations } from 'next-intl/server';
import DashboardPageHeader from '@UI/DashboardPageHeader';

export default async function PetsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const [{ page }, t] = await Promise.all([
        searchParams,
        getTranslations('dashboard.myPets'),
    ]);
    const pageNumber = Math.max(1, Number(page) || 1);
    return (
        <>
            <DashboardPageHeader
                title={t('titles.title')}
                description={t('titles.description')}
            />
            <MyPets page={pageNumber} />
        </>
    );
}
