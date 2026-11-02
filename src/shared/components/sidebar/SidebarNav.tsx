'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Database } from '@supabase/database.types';
import { useDashboardNav } from '@shared/hooks/useDashboardNav';

type UserRole = Database['public']['Enums']['user_role'];

export default function SideBarNav({ role }: { role: UserRole }) {
    const t = useTranslations('sidebar');
    const pathname = usePathname();
    const visibleNavigation = useDashboardNav(role);

    return (
        <nav>
            <ul className="flex flex-col gap-2">
                {visibleNavigation.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={item.href}
                            className={`flex font-heading items-center gap-2.5 font-bold px-3 py-2.5 rounded-full transition-colors ${
                                pathname.includes(item.href)
                                    ? 'bg-soft text-accent'
                                    : 'text-muted hover:bg-soft hover:text-accent'
                            }`}
                        >
                            <span className="text-xl">
                                <item.icon />
                            </span>
                            {t(item.id)}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
