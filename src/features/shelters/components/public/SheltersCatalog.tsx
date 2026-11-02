import { getTranslations } from 'next-intl/server';
import MyPagination from '@shared/components/UI/Pagination';
import { getPublicShelters } from '../../queries';
import { SHELTER_CATALOG_PAGE_SIZE } from '../../constants';
import ShelterCard from './ShelterCard';

export default async function SheltersCatalog({ page }: { page: number }) {
    const t = await getTranslations('sheltersPage');
    const { data: shelters, total } = await getPublicShelters({
        page,
        pageSize: SHELTER_CATALOG_PAGE_SIZE,
    });
    const totalPages = Math.ceil(total / SHELTER_CATALOG_PAGE_SIZE);

    return (
        <>
            <p className="text-muted font-bold mb-4" aria-live="polite">
                {t('results', { count: total })}
            </p>

            {shelters.length > 0 ? (
                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {shelters.map((shelter) => (
                        <li key={shelter.id}>
                            <ShelterCard shelter={shelter} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="bg-surface rounded-card ring-1 ring-border p-10 text-center">
                    <p className="font-display font-extrabold text-xl">
                        {t('empty')}
                    </p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-8">
                    <MyPagination
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                        pageSize={SHELTER_CATALOG_PAGE_SIZE}
                    />
                </div>
            )}
        </>
    );
}
