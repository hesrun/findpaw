import { buttonVariants } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import NotFoundCat from '@UI/NotFoundCat';
import { Link } from '@/i18n/navigation';

// Localized 404 inside the site layout: for notFound() in pages and,
// through [...rest], for any unknown path under a locale.
export default async function NotFound() {
    const t = await getTranslations('notFound');

    return (
        <main className="container flex-1 grid place-items-center py-12">
            <div className="grid justify-items-center gap-6 text-center">
                <div
                    className="flex items-center gap-2 sm:gap-4 font-display font-extrabold text-accent leading-none text-[7rem] sm:text-[11rem]"
                    aria-label="404"
                >
                    <span aria-hidden>4</span>
                    <div className="w-32 sm:w-52">
                        <NotFoundCat label={t('catLabel')} />
                    </div>
                    <span aria-hidden>4</span>
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-balance">
                    {t('title')}
                </h1>
                <p className="text-muted max-w-[46ch]">{t('text')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/" className={buttonVariants({ size: 'lg' })}>
                        {t('home')}
                    </Link>
                    <Link
                        href="/pets"
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
