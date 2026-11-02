'use client';

import { useState } from 'react';

// Open state of the mobile menu drawer. Links call `close` so the drawer
// does not stay open over the page they navigate to.
export function useMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    function close() {
        setIsOpen(false);
    }

    return { isOpen, setIsOpen, close };
}
