'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdPets, MdSettings } from 'react-icons/md';
import { TbHomeShield } from 'react-icons/tb';
import type { Database } from '../../../../supabase/database.types';

type UserRole = Database['public']['Enums']['user_role'];

type NavItem = {
    name: string;
    href: string;
    icon: React.ReactNode;
    roles: UserRole[];
};

export default function SideBarNav({ role }: { role: UserRole }) {
    const t = useTranslations('sidebar');
    const pathname = usePathname();

    const navigation: NavItem[] = [
        {
            name: t('pets'),
            href: '/dashboard/pets',
            icon: <MdPets />,
            roles: ['user', 'shelter', 'admin', 'clinic'],
        },
        {
            name: t('shelters'),
            href: '/dashboard/shelters',
            icon: <TbHomeShield />,
            roles: ['shelter', 'admin'],
        },
        {
            name: t('settings'),
            href: '/dashboard/settings',
            icon: <MdSettings />,
            roles: ['user', 'shelter', 'admin', 'clinic'],
        },
    ];

    const visibleNavigation = navigation.filter((item) =>
        item.roles.includes(role),
    );

    return (
        <nav>
            <ul className="flex flex-col gap-2">
                {visibleNavigation.map((item) => (
                    <li key={item.name}>
                        <Link
                            href={item.href}
                            className={`flex font-heading items-center gap-2 font-bold p-2 rounded ${
                                pathname.includes(item.href)
                                    ? 'bg-accent text-white'
                                    : 'text-accent hover:bg-accent hover:text-white'
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
