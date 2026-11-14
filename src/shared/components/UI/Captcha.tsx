'use client';

import type { Ref } from 'react';
import { useLocale } from 'next-intl';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type CaptchaProps = {
    ref: Ref<TurnstileInstance | undefined>;
};

// Cloudflare Turnstile widget for auth forms. It adds a hidden `captchaToken`
// input to the surrounding form; the server action passes the token to
// Supabase Auth, which verifies it. Without a site key nothing is rendered, so
// local development works against a Supabase stack without captcha.
export function Captcha({ ref }: CaptchaProps) {
    const locale = useLocale();

    if (!SITE_KEY) return null;

    return (
        <Turnstile
            ref={ref}
            siteKey={SITE_KEY}
            options={{
                language: locale,
                size: 'flexible',
                responseFieldName: 'captchaToken',
            }}
        />
    );
}
