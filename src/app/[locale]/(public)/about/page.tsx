import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AboutPage from '@features/about/AboutPage';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('aboutPage');
    return {
        title: t('metaTitle'),
        description: t('lead'),
    };
}

export default function About() {
    return <AboutPage />;
}
