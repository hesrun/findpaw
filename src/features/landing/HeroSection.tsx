import { buttonVariants, Link } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import clsx from 'clsx';
import type { Enums } from '@supabase/database.types';
import PetPlaceholder from '@UI/PetPlaceholder';
import { countPublicPets } from '@features/pets/queries';
import HeroBlobs from './HeroBlobs';
import { ROUTES } from '@shared/constants/routes';

// Round pet face set inline with the headline text.
function InlineFace({
    species,
    tilt,
}: {
    species: Enums<'pet_species'>;
    tilt: 'left' | 'right';
}) {
    return (
        <span
            className={clsx(
                'inline-block size-[1.05em] align-[-0.18em] mx-[0.04em] overflow-hidden rounded-full border-[0.07em] border-surface shadow-my',
                tilt === 'left' ? '-rotate-8' : 'rotate-7',
            )}
        >
            <PetPlaceholder species={species} round />
        </span>
    );
}

export default async function HeroSection() {
    const t = await getTranslations('HomePage');
    const petsCount = await countPublicPets();

    return (
        <section>
            <div className="container">
                <div className="bg-hero rounded-[36px] p-6 sm:p-10 lg:p-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
                    <div>
                        <h1 className="font-display font-extrabold text-4xl sm:text-5xl xl:text-6xl leading-[1.04] tracking-tight text-balance">
                            {t.rich('heroTitle', {
                                cat: () => <InlineFace species="cat" tilt="left" />,
                                dog: () => <InlineFace species="dog" tilt="right" />,
                            })}
                        </h1>
                        <p className="mt-4 max-w-[46ch] text-lg text-muted">
                            {t('heroDescription')}
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-3.5">
                            <Link
                                href={ROUTES.pets}
                                className={buttonVariants({
                                    size: 'lg',
                                    variant: 'primary',
                                })}
                            >
                                {t('browsePets')}
                            </Link>
                            <Link
                                href={ROUTES.dashboard.addPet}
                                className={buttonVariants({
                                    size: 'lg',
                                    variant: 'outline',
                                })}
                            >
                                {t('reportLost')}
                            </Link>
                        </div>
                        {petsCount > 0 && (
                            <div className="mt-6 flex items-center gap-3 text-sm font-bold text-muted">
                                <div className="flex">
                                    {(['cat', 'dog', 'rabbit'] as const).map(
                                        (species, index) => (
                                            <span
                                                key={species}
                                                className={clsx(
                                                    'size-[34px] overflow-hidden rounded-full border-[2.5px] border-surface',
                                                    index > 0 && '-ml-2.5',
                                                )}
                                            >
                                                <PetPlaceholder
                                                    species={species}
                                                    round
                                                />
                                            </span>
                                        ),
                                    )}
                                </div>
                                <span>
                                    {t.rich('petsWaiting', {
                                        count: petsCount,
                                        b: (chunks) => (
                                            <b className="text-foreground">
                                                {chunks}
                                            </b>
                                        ),
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                    <HeroBlobs />
                </div>
            </div>
        </section>
    );
}
