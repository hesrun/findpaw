import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs/config';
import path from 'path';

const nextConfig: NextConfig = {
    reactCompiler: true,
    turbopack: {
        root: path.resolve(__dirname),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();

// Uploads source maps to Sentry at build time, so stack traces show the
// original code. Without SENTRY_AUTH_TOKEN (local builds) the upload is skipped.
export default withSentryConfig(withNextIntl(nextConfig), {
    org: 'findpaw-ei',
    project: 'findpaw',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    widenClientFileUpload: true,
});
