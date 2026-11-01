'use client';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

const navigations = [
    {
        key: 'pets',
        href: '/pets',
    },
    {
        key: 'shelters',
        href: '/shelters',
    },
    {
        key: 'about',
        href: '/about',
    },
] as const;

export default function HeaderNav() {
    const t = useTranslations('header');
    const pathname = usePathname();

    return (
        <nav className="flex gap-6">
            {navigations.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    className={clsx(
                        'transition-colors font-bold',
                        // next-intl's pathname has no locale prefix (/pets/123)
                        pathname === item.href ||
                            pathname.startsWith(`${item.href}/`)
                            ? 'text-foreground'
                            : 'text-muted hover:text-accent',
                    )}
                >
                    {t(item.key)}
                </Link>
            ))}
        </nav>
    );
}
