import { getTranslations } from 'next-intl/server';
import ShelterForm from '@/features/shelters/components/dashboard/ShelterForm';

export default async function AddShelterPage() {
    const t = await getTranslations('dashboard.myShelters');
    return (
        <div>
            <h1 className="text-accent text-3xl font-medium mb-8">
                {t('titles.addShelter')}
            </h1>
            <ShelterForm />
        </div>
    );
}
