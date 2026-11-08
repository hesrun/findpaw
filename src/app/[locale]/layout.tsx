import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Baloo_2, Nunito } from 'next/font/google';
import type { Metadata } from 'next';
import '@/css/styles.css';
import Header from '@components/header/Header';
import Footer from '@components/footer/Footer';
import { routing } from '@/i18n/routing';
import { Toast } from '@heroui/react';
import TanstackProvider from '@shared/providers/TanstackProvider';
import { SITE_NAME, SITE_URL } from '@shared/constants/seo';
import { pageMetadata } from '@shared/lib/seo';

// Site-wide defaults. Public pages override them with pageMetadata();
// pages without their own metadata (dashboard) inherit these.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });
    // No canonical here: a canonical inherited by every page would point
    // them all at the landing page.
    const { description, openGraph, twitter } = pageMetadata({
        locale,
        path: '/',
        title: t('siteTitle'),
        description: t('siteDescription'),
        absoluteTitle: true,
    });

    return {
        metadataBase: new URL(SITE_URL),
        title: { default: t('siteTitle'), template: `%s | ${SITE_NAME}` },
        description,
        openGraph,
        twitter,
    };
}

const nunito = Nunito({
    subsets: ['latin', 'cyrillic'],
    variable: '--font-nunito',
});

// Display titles only. No Cyrillic in Baloo 2; the site ships en/cs (latin-ext).
const baloo = Baloo_2({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-baloo',
});

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    return (
        <html lang={locale} className={`${nunito.variable} ${baloo.variable}`}>
            <body className="bg-background text-foreground">
                <TanstackProvider>
                    <NextIntlClientProvider locale={locale}>
                        <Toast.Provider />
                        {/* Header and page fill the screen; the footer
                            always starts below the fold. */}
                        <div className="flex flex-col min-h-dvh">
                            <Header />
                            {children}
                        </div>
                        <Footer />
                    </NextIntlClientProvider>
                </TanstackProvider>
            </body>
        </html>
    );
}
