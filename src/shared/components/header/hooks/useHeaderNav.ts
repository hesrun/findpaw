'use client';

import { usePathname } from '@/i18n/navigation';
import { HEADER_NAV } from '@shared/constants/headerNav';

// Header links with their active state. next-intl's pathname has no locale
// prefix (/pets/123), so it compares directly with the hrefs.
export function useHeaderNav() {
    const pathname = usePathname();

    return HEADER_NAV.map((item) => ({
        ...item,
        isActive:
            pathname === item.href || pathname.startsWith(`${item.href}/`),
    }));
}
