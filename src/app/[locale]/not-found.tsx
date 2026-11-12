import { buttonVariants } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@shared/constants/routes';
// Localized 404 inside the site layout: for notFound() in pages and,
// through [...rest], for any unknown path under a locale.
export default async function NotFound() {
    const t = await getTranslations('notFound');

    return (
        <main className="container flex-1 grid place-items-center py-12">
            <div className="grid justify-items-center gap-6 text-center">
                {/* The photo fades to white at the edges; the radial mask
                    blends that fade into the page background in both themes. */}
                <Image
                    src="/images/not-found.webp"
                    alt={t('catLabel')}
                    width={1408}
                    height={768}
                    loading="eager"
                    sizes="(min-width: 768px) 720px, 100vw"
                    className="w-full max-w-180 h-auto mask-[radial-gradient(ellipse_closest-side,black_70%,transparent)]"
                />
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-balance">
                    {t('title')}
                </h1>
                <p className="text-muted max-w-[46ch]">{t('text')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link href={ROUTES.home} className={buttonVariants({ size: 'lg' })}>
                        {t('home')}
                    </Link>
                    <Link
                        href={ROUTES.pets}
                        className={buttonVariants({
                            size: 'lg',
                            variant: 'outline',
                        })}
                    >
                        {t('pets')}
                    </Link>
                </div>
            </div>
        </main>
    );
}
