'use client';

import type { Key } from 'react';
import { useRouter } from '@/i18n/navigation';
import { signOut } from '@features/auth/actions/actions';
import { DASHBOARD_NAV } from '@shared/constants/dashboardNav';

export const SIGN_OUT_ACTION = 'signOut';

export function useHeaderUserMenu() {
    const router = useRouter();

    function handleAction(key: Key) {
        if (key === SIGN_OUT_ACTION) {
            signOut();
            return;
        }

        const item = DASHBOARD_NAV.find((navItem) => navItem.id === key);
        if (item) router.push(item.href);
    }

    return { handleAction };
}
