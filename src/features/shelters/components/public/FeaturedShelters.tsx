'use client';

import { useTranslations } from 'next-intl';
import type { getPublicShelters } from '../../queries';
import { usePublicShelters } from '../../hooks';

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
                <h2 className="text-accent font-heading font-bold text-3xl mt-12 mb-4">
                    {t('recentSheltersTitle')}
                </h2>

                {isFetching ? (
                    <p>{t('loadingShelters')}</p>
                ) : shelters.length > 0 ? (
                    <ul className="grid grid-cols-3 gap-4">
                        {shelters.map((shelter) => (
                            <li key={shelter.id}>
                                <article className="shelter-card">
                                    <h3>{shelter.name}</h3>
                                    {shelter.city && <p>{shelter.city}</p>}
                                    {shelter.description && (
                                        <p>{shelter.description}</p>
                                    )}
                                </article>
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
