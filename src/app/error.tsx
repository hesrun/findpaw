'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorPage({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    // An error boundary swallows the error, so report it explicitly.
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <div>
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <button onClick={() => retry()}>Try again</button>
        </div>
    );
}
