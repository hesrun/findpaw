import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AudienceSection from '@features/landing/AudienceSection';
import CtaSection from '@features/landing/CtaSection';
import FeaturesSection from '@features/landing/FeaturesSection';
import HeroSection from '@features/landing/HeroSection';
import PetsSection from '@features/landing/PetsSection';
import SheltersSection from '@features/landing/SheltersSection';
import { pageMetadata } from '@shared/lib/seo';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });
    return pageMetadata({
        locale,
        path: '/',
        title: t('siteTitle'),
        description: t('siteDescription'),
        absoluteTitle: true,
    });
}

export default function HomePage() {
    return (
        <main className="pt-6">
            <HeroSection />
            <AudienceSection />
            <PetsSection />
            <FeaturesSection />
            <SheltersSection />
            <CtaSection />
        </main>
    );
}
