import { getTranslations } from 'next-intl/server';
import ShelterForm from '@/features/shelters/components/dashboard/ShelterForm';
import { getMyShelter } from '@features/shelters/queries';
import { notFound } from 'next/navigation';

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
        <div>
            <h1 className={'text-accent text-3xl font-medium mb-8'}>
                {t('titles.editShelter')}
            </h1>
            <ShelterForm initialData={shelter} />
        </div>
    );
}
