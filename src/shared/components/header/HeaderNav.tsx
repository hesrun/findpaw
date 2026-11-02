'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useHeaderNav } from './hooks/useHeaderNav';

// Desktop navigation; on small screens the links live in HeaderMobileMenu.
export default function HeaderNav() {
    const t = useTranslations('header');
    const items = useHeaderNav();

    return (
        <nav className="hidden md:flex gap-6">
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    className={clsx(
                        'transition-colors font-bold',
                        item.isActive
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
