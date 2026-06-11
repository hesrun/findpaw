'use client';

import { Dropdown } from '@heroui/react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            <Dropdown>
                <Dropdown.Trigger className="flex items-center gap-2 cursor-pointer">
                    <img className="w-6" src={`/flags/${locale}.svg`} alt="" />
                    <span className="font-heading font-bold text-sm">
                        {locale.toUpperCase()}
                    </span>
                </Dropdown.Trigger>
                <Dropdown.Popover
                    placement="bottom right"
                    className="min-w-auto"
                >
                    <Dropdown.Menu aria-label="Language">
                        {routing.locales.map((l) => (
                            <Dropdown.Item
                                key={l}
                                onClick={() =>
                                    router.replace(pathname, { locale: l })
                                }
                            >
                                <img
                                    className="w-6"
                                    src={`/flags/${l}.svg`}
                                    alt=""
                                />
                                <span className="font-heading font-bold text-sm">
                                    {l.toUpperCase()}
                                </span>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </>
    );
}
