'use client';

import { useTranslations } from 'next-intl';
import type { getPublicShelters } from '../../queries';
import { usePublicShelters } from '../../hooks';
import ShelterCard from './ShelterCard';
import ShelterCardSkeleton from './ShelterCardSkeleton';

type PublicSheltersResult = Awaited<ReturnType<typeof getPublicShelters>>;

const PAGE_SIZE = 6;

export default function FeaturedShelters({
    initialData,
}: {
    initialData: PublicSheltersResult;
}) {
    const t = useTranslations('HomePage');
    const { data, isFetching } = usePublicShelters(
        { pageSize: PAGE_SIZE },
        initialData,
    );
    const shelters = data?.data ?? [];

    return (
        <section>
            <div className="container">
                <h2 className="font-display font-extrabold text-3xl mt-14 mb-4">
                    {t('recentSheltersTitle')}
                </h2>

                {isFetching ? (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        aria-busy="true"
                        aria-label={t('loadingShelters')}
                    >
                        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                            <ShelterCardSkeleton key={index} />
                        ))}
                    </div>
                ) : shelters.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shelters.map((shelter) => (
                            <li key={shelter.id}>
                                <ShelterCard shelter={shelter} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{t('noSheltersFound')}</p>
                )}
            </div>
        </section>
    );
}
