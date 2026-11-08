import { getTranslations } from 'next-intl/server';
import {
    PET_LOCATION_PUBLIC_RADIUS_M,
    PET_MAX_PHOTOS,
} from '@features/pets/constants';
import { LANDING_FEATURES } from './constants';

export default async function FeaturesSection() {
    const t = await getTranslations('HomePage.features');
    // Numbers some texts mention, taken from the rules the code enforces.
    const values = {
        photos: PET_MAX_PHOTOS,
        radius: PET_LOCATION_PUBLIC_RADIUS_M,
    };

    return (
        <section className="mt-14">
            <div className="container">
                <h2 className="font-display font-extrabold text-3xl mb-2">
                    {t('title')}
                </h2>
                <p className="text-muted mb-6 max-w-[60ch]">{t('lead')}</p>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {LANDING_FEATURES.map(({ key, icon: Icon }) => (
                        <li
                            key={key}
                            className="bg-surface rounded-card shadow-my ring-1 ring-border p-5 grid gap-3 content-start"
                        >
                            <span
                                aria-hidden
                                className="size-11 rounded-2xl bg-soft text-accent flex items-center justify-center text-xl"
                            >
                                <Icon />
                            </span>
                            <h3 className="font-display font-extrabold text-lg">
                                {t(`items.${key}.title`, values)}
                            </h3>
                            <p className="text-sm text-muted leading-relaxed">
                                {t(`items.${key}.text`, values)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
