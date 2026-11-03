import { getTranslations } from 'next-intl/server';
import { MAPY_API_KEY } from '@shared/constants/map';
import type { Pet } from '@/types/pets';
import PetAreaMapLazy from './PetAreaMapLazy';

// "Around here" map block on the public pet page.
// Renders nothing without a point or without a Mapy.com key.
export default async function PetAreaSection({
    pet,
}: {
    pet: Pick<Pet, 'latitude' | 'longitude' | 'listing_type'>;
}) {
    const t = await getTranslations('petsPage.detail');
    if (!MAPY_API_KEY || pet.latitude == null || pet.longitude == null) {
        return null;
    }

    return (
        <section className="bg-surface rounded-card shadow-my ring-1 ring-border p-5 grid gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display font-extrabold text-xl">
                    {t(`mapTitle.${pet.listing_type}`)}
                </h2>
                <span className="text-sm text-muted">
                    {t('mapApproximate')}
                </span>
            </div>
            <PetAreaMapLazy lat={pet.latitude} lng={pet.longitude} />
        </section>
    );
}
