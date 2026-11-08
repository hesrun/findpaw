import AudienceSection from '@features/landing/AudienceSection';
import CtaSection from '@features/landing/CtaSection';
import FeaturesSection from '@features/landing/FeaturesSection';
import HeroSection from '@features/landing/HeroSection';
import PetsSection from '@features/landing/PetsSection';
import SheltersSection from '@features/landing/SheltersSection';

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
