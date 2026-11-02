import { getTranslations } from 'next-intl/server';
import MyPagination from '@shared/components/UI/Pagination';
import { getPublicPets } from '@features/pets/queries';
import PetCard from '@features/pets/components/public/PetCard';
import { SHELTER_PETS_PAGE_SIZE } from '../../constants';

// Public pets of one shelter, newest first. Only `page` comes from the URL.
export default async function ShelterPets({
    shelterId,
    page,
}: {
    shelterId: string;
    page: number;
}) {
    const t = await getTranslations('sheltersPage.detail');
    const { data: pets, total } = await getPublicPets(
        { page, pageSize: SHELTER_PETS_PAGE_SIZE },
        { shelterId },
    );
    const totalPages = Math.ceil(total / SHELTER_PETS_PAGE_SIZE);

    return (
        <section className="mt-12">
            <h2 className="font-display font-extrabold text-2xl mb-4">
                {t('pets', { count: total })}
            </h2>

            {pets.length > 0 ? (
                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {pets.map((pet) => (
                        <li key={pet.id}>
                            <PetCard pet={pet} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="bg-surface rounded-card ring-1 ring-border p-10 text-center">
                    <p className="text-muted">{t('noPets')}</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-8">
                    <MyPagination
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                        pageSize={SHELTER_PETS_PAGE_SIZE}
                    />
                </div>
            )}
        </section>
    );
}
