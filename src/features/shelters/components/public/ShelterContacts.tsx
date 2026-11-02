import { getTranslations } from 'next-intl/server';
import { PiEnvelopeSimple, PiGlobe, PiMapPin, PiPhone } from 'react-icons/pi';
import { isHttpUrl } from '@shared/lib/url';
import type { Shelter } from '@/types/shelters';
import ContactLink from './ContactLink';

export default async function ShelterContacts({
    shelter,
}: {
    shelter: Shelter;
}) {
    const t = await getTranslations('sheltersPage.detail');
    const location = [shelter.city, shelter.address].filter(Boolean).join(', ');
    // Also checked on save; re-checked here for rows written outside the form.
    const website =
        shelter.website && isHttpUrl(shelter.website) ? shelter.website : null;
    const websiteLabel = website
        ? new URL(website).hostname.replace(/^www\./, '')
        : null;
    const hasContacts = Boolean(shelter.phone || shelter.email || website);

    return (
        <aside className="bg-surface rounded-card shadow-my ring-1 ring-border p-5 grid gap-4 lg:sticky lg:top-6">
            <div>
                <h1 className="font-display font-extrabold text-3xl leading-tight">
                    {shelter.name}
                </h1>
                {location && (
                    <p className="text-muted flex items-center gap-1 mt-1">
                        <PiMapPin className="shrink-0" aria-hidden />
                        <span>{location}</span>
                    </p>
                )}
            </div>

            <section>
                <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-muted mb-2">
                    {t('contacts')}
                </h2>
                {hasContacts ? (
                    <ul className="grid gap-2">
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
                        {website && (
                            <ContactLink
                                href={website}
                                icon={<PiGlobe />}
                                external
                            >
                                {websiteLabel}
                            </ContactLink>
                        )}
                    </ul>
                ) : (
                    <p className="text-sm text-muted">{t('noContacts')}</p>
                )}
            </section>
        </aside>
    );
}
