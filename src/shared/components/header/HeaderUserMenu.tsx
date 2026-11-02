'use client';

import { Avatar, Dropdown, Label } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { LuLogOut } from 'react-icons/lu';
import type { Database } from '@supabase/database.types';
import { useDashboardNav } from '@shared/hooks/useDashboardNav';
import { SIGN_OUT_ACTION, useHeaderUserMenu } from './hooks/useHeaderUserMenu';

type UserRole = Database['public']['Enums']['user_role'];

export default function HeaderUserMenu({
    name,
    email,
    avatarUrl,
    role,
}: {
    name: string;
    email: string;
    avatarUrl: string | null;
    role: UserRole;
}) {
    const t = useTranslations();
    const navItems = useDashboardNav(role);
    const { handleAction } = useHeaderUserMenu();

    return (
        <Dropdown>
            <Dropdown.Trigger
                aria-label={t('header.userMenu')}
                className="flex items-center gap-2 cursor-pointer rounded-full"
            >
                <Avatar size="sm">
                    {avatarUrl && <Avatar.Image alt={name} src={avatarUrl} />}
                    <Avatar.Fallback>
                        {name.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                </Avatar>
                <span className="hidden sm:inline font-heading font-bold text-sm max-w-40 truncate">
                    {name}
                </span>
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom right" className="min-w-56">
                <div className="p-3 border-b ring-border">
                    <span className="text-sm font-bold truncate">{email}</span>
                </div>
                <Dropdown.Menu
                    aria-label={t('header.userMenu')}
                    onAction={handleAction}
                >
                    <Dropdown.Section>
                        {navItems.map((item) => (
                            <Dropdown.Item
                                key={item.id}
                                id={item.id}
                                textValue={t(`sidebar.${item.id}`)}
                            >
                                <item.icon className="size-4 shrink-0 text-muted" />
                                <Label>{t(`sidebar.${item.id}`)}</Label>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Section>
                    <Dropdown.Section>
                        <Dropdown.Item
                            id={SIGN_OUT_ACTION}
                            textValue={t('auth.btns.signOut')}
                            variant="danger"
                        >
                            <LuLogOut className="size-4 shrink-0 text-danger" />
                            <Label>{t('auth.btns.signOut')}</Label>
                        </Dropdown.Item>
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
