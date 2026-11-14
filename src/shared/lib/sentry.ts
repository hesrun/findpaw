import type { init } from '@sentry/nextjs';

// One Sentry setup for the browser, Node.js, and edge runtimes. Errors only:
// no tracing or session replay. Without a DSN (local development) Sentry is off.
//
// `dataCollection` defaults to collecting everything, so it is turned off item
// by item: cookies hold the Supabase session, server action bodies hold
// passwords, the email-link query holds `token_hash`, and stack frame
// variables can hold any of them. A report keeps the error, stack trace, page
// address without query, and browser.
export const SENTRY_OPTIONS = {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
    tracesSampleRate: 0,
    dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        databaseQueryData: false,
        stackFrameVariables: false,
    },
} satisfies Parameters<typeof init>[0];
