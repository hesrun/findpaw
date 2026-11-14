'use client';

import { useRef } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

// Ref for the `Captcha` widget. A Turnstile token is single-use, so a form
// calls `resetCaptcha` after every submit to get a fresh token for a retry.
export function useCaptcha() {
    const captchaRef = useRef<TurnstileInstance>(undefined);

    function resetCaptcha() {
        captchaRef.current?.reset();
    }

    return { captchaRef, resetCaptcha };
}
