import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { HEADER_NAV } from '@shared/constants/headerNav';
import { LEGAL_OPERATOR } from '@shared/constants/legal';
import { ROUTES } from '@shared/constants/routes';

const LEGAL_LINKS = Object.entries(ROUTES.legal) as [
    keyof typeof ROUTES.legal,
    string,
][];

const linkClass = 'text-muted hover:text-accent transition-colors';

export default async function Footer() {
    const [t, tNav] = await Promise.all([
        getTranslations('footer'),
        getTranslations('header'),
    ]);

    return (
        <footer className="bg-surface border-t border-border px-4 py-10 sm:px-6">
            <div className="container grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
                <div className="grid gap-3 content-start">
                    <Link href={ROUTES.home} className="w-fit">
                        <Image
                            width={128}
                            height={32}
                            className="w-28 h-auto"
                            src="/logo/LogoColor.svg"
                            alt="logo"
                        />
                    </Link>
                    <p className="text-muted max-w-[36ch]">{t('tagline')}</p>
                </div>
                <nav
                    aria-label={t('explore')}
                    className="grid gap-2 content-start"
                >
                    <h2 className="font-bold">{t('explore')}</h2>
                    {HEADER_NAV.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={linkClass}
                        >
                            {tNav(item.key)}
                        </Link>
                    ))}
                </nav>
                <nav
                    aria-label={t('legal')}
                    className="grid gap-2 content-start"
                >
                    <h2 className="font-bold">{t('legal')}</h2>
                    {LEGAL_LINKS.map(([key, href]) => (
                        <Link key={key} href={href} className={linkClass}>
                            {t(key)}
                        </Link>
                    ))}
                    <a
                        href={`mailto:${LEGAL_OPERATOR.email}`}
                        className={linkClass}
                    >
                        {t('contact')}
                    </a>
                </nav>
            </div>
            <p className="container mt-8 pt-6 border-t border-border text-sm text-muted">
                {t('copyright', { year: new Date().getFullYear() })}
            </p>
        </footer>
    );
}
