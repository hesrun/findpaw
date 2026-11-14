import * as Sentry from '@sentry/nextjs';
import { SENTRY_OPTIONS } from '@shared/lib/sentry';

// Browser errors: uncaught exceptions and unhandled promise rejections.
Sentry.init(SENTRY_OPTIONS);
