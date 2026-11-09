import { getTranslations } from 'next-intl/server';
import ShelterForm from '@/features/shelters/components/dashboard/ShelterForm';
import { getMyShelter } from '@features/shelters/queries';
import { notFound } from 'next/navigation';
import DashboardPageHeader from '@UI/DashboardPageHeader';

export default async function EditShelterPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const t = await getTranslations('dashboard.myShelters');

    let shelter;
    try {
        shelter = await getMyShelter(id);
    } catch {
        notFound();
    }

    return (
        <>
            <DashboardPageHeader title={t('titles.editShelter')} />
            <ShelterForm initialData={shelter} />
        </>
    );
}
