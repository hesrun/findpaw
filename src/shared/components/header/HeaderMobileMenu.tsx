'use client';

import { Button, Drawer } from '@heroui/react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { LuMenu } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import { useHeaderNav } from './hooks/useHeaderNav';
import { useMobileMenu } from './hooks/useMobileMenu';

// Burger button and side drawer with the header links, below the md breakpoint.
export default function HeaderMobileMenu() {
    const t = useTranslations('header');
    const items = useHeaderNav();
    const { isOpen, setIsOpen, close } = useMobileMenu();

    return (
        <div className="md:hidden">
            <Button
                isIconOnly
                variant="ghost"
                aria-label={t('openMenu')}
                onPress={() => setIsOpen(true)}
            >
                <LuMenu className="text-2xl" aria-hidden />
            </Button>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Content placement="right">
                    <Drawer.Dialog>
                        <Drawer.CloseTrigger />
                        <Drawer.Header>
                            <Drawer.Heading className="font-display font-extrabold text-xl">
                                {t('menu')}
                            </Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body>
                            <nav>
                                <ul className="grid gap-1">
                                    {items.map((item) => (
                                        <li key={item.key}>
                                            <Link
                                                href={item.href}
                                                onClick={close}
                                                aria-current={
                                                    item.isActive
                                                        ? 'page'
                                                        : undefined
                                                }
                                                className={clsx(
                                                    'block rounded-full px-4 py-3 font-heading font-bold text-lg transition-colors',
                                                    item.isActive
                                                        ? 'bg-soft text-accent'
                                                        : 'text-foreground hover:bg-soft hover:text-accent',
                                                )}
                                            >
                                                {t(item.key)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </div>
    );
}
