import MyPets from '@/features/pets/components/dashboard/MyPets';
import { getTranslations } from 'next-intl/server';

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
            <div className="mb-6">
                <h1 className="font-display font-extrabold text-3xl mb-2">
                    {t('titles.title')}
                </h1>
                <p className="text-muted">{t('titles.description')}</p>
            </div>
            <MyPets page={pageNumber} />
        </>
    );
}
