import HeroSection from '@features/landing/HeroSection';
import PetsSection from '@features/landing/PetsSection';
import SheltersSection from '@features/landing/SheltersSection';

export default function HomePage() {
    return (
        <main className="pt-6">
            <HeroSection />
            <PetsSection />
            <SheltersSection />
        </main>
    );
}
