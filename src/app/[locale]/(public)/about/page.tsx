import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AboutPage from '@features/about/AboutPage';
import { metaDescription, pageMetadata } from '@shared/lib/seo';
import { ROUTES } from '@shared/constants/routes';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'aboutPage' });
    return pageMetadata({
        locale,
        path: ROUTES.about,
        title: t('metaTitle'),
        description: metaDescription(t('lead')),
    });
}

export default function About() {
    return <AboutPage />;
}
