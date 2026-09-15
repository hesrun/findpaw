import HeroSection from '@features/landing/HeroSection';
import PetsSection from '@features/landing/PetsSection';

export default function HomePage() {
    return (
        <main className="pt-6">
            <HeroSection />
            <PetsSection />
        </main>
    );
}
