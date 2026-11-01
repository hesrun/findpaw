'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
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
                        // pathname carries the locale prefix (/en/pets)
                        pathname.endsWith(item.href)
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
