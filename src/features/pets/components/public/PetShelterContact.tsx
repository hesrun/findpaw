import { getTranslations } from 'next-intl/server';
import { PiEnvelopeSimple, PiPhone } from 'react-icons/pi';
import ContactLink from '@features/shelters/components/public/ContactLink';
import type { Shelter } from '@/types/shelters';

export default async function PetShelterContact({
    shelter,
}: {
    shelter: Pick<Shelter, 'name' | 'city' | 'address' | 'phone' | 'email'>;
}) {
    const t = await getTranslations('petsPage.detail');
    const location = [shelter.city, shelter.address].filter(Boolean).join(', ');

    return (
        <section className="bg-surface rounded-card shadow-my ring-1 ring-border p-5">
            <h2 className="font-display font-extrabold text-xl mb-1">
                {t('contactShelter')}
            </h2>
            <p className="font-heading font-bold">{shelter.name}</p>
            {location && <p className="text-sm text-muted">{location}</p>}
            {(shelter.phone || shelter.email) && (
                <ul className="grid gap-2 mt-4">
                    {shelter.phone && (
                        <ContactLink
                            href={`tel:${shelter.phone}`}
                            icon={<PiPhone />}
                        >
                            {shelter.phone}
                        </ContactLink>
                    )}
                    {shelter.email && (
                        <ContactLink
                            href={`mailto:${shelter.email}`}
                            icon={<PiEnvelopeSimple />}
                        >
                            {shelter.email}
                        </ContactLink>
                    )}
                </ul>
            )}
        </section>
    );
}
