import { getTranslations } from 'next-intl/server';
import MyPagination from '@shared/components/UI/Pagination';
import { getPublicPets } from '../../queries';
import type { PetFilters } from '../../schemas';
import PetCard from './PetCard';
import { CATALOG_PAGE_SIZE } from '../../constants';

export default async function PetsCatalog({
    filters,
}: {
    filters: PetFilters;
}) {
    const t = await getTranslations('petsPage');
    const page = filters.page ?? 1;
    const { data: pets, total } = await getPublicPets({
        ...filters,
        page,
        pageSize: CATALOG_PAGE_SIZE,
    });
    const totalPages = Math.ceil(total / CATALOG_PAGE_SIZE);

    return (
        <>
            <p className="text-muted font-bold mb-4" aria-live="polite">
                {t('results', { count: total })}
            </p>

            {pets.length > 0 ? (
                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {pets.map((pet) => (
                        <li key={pet.id}>
                            <PetCard pet={pet} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="surface-card p-10 text-center">
                    <p className="font-display font-extrabold text-xl mb-1">
                        {t('empty')}
                    </p>
                    <p className="text-muted">{t('emptyHint')}</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-8">
                    <MyPagination
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                        pageSize={CATALOG_PAGE_SIZE}
                    />
                </div>
            )}
        </>
    );
}
