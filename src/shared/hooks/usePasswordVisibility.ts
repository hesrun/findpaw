'use client';

import { useState } from 'react';

// Show/hide toggle for a password input: `type` goes to the field.
export function usePasswordVisibility() {
    const [isVisible, setIsVisible] = useState(false);

    function toggle() {
        setIsVisible((visible) => !visible);
    }

    return { isVisible, toggle, type: isVisible ? 'text' : 'password' };
}
