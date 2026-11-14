import * as Sentry from '@sentry/nextjs';
import { SENTRY_OPTIONS } from '@shared/lib/sentry';

// Runs once per server instance, in both the Node.js and edge runtimes.
export function register() {
    Sentry.init(SENTRY_OPTIONS);
}

// Errors thrown while rendering or in route handlers and server actions.
export const onRequestError = Sentry.captureRequestError;
