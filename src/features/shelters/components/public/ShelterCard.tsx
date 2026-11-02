import type { Shelter } from '@/types/shelters';
import Image from 'next/image';
import { isHttpUrl } from '@shared/lib/url';
import { PiEnvelopeSimple, PiGlobe, PiMapPin, PiPhone } from 'react-icons/pi';
import { ShelterPlaceholder } from '@UI/PetPlaceholder';
import { Link } from '@/i18n/navigation';
import ContactLink from './ContactLink';

export default function ShelterCard({ shelter }: { shelter: Shelter }) {
    const location = [shelter.city, shelter.address].filter(Boolean).join(', ');
    const image = shelter.img_url?.[0];
    // Also checked on save; re-checked here for rows written outside the form.
    const website =
        shelter.website && isHttpUrl(shelter.website) ? shelter.website : null;
    const websiteLabel = website
        ? new URL(website).hostname.replace(/^www\./, '')
        : null;

    return (
        <article className="group relative bg-surface rounded-card shadow-my ring-1 ring-border h-full flex flex-col transition-shadow duration-300 hover:ring-accent/40 has-focus-visible:ring-accent">
            <div className="relative m-2 mb-0 aspect-2/1 overflow-hidden rounded-media">
                {image ? (
                    <Image
                        src={image}
                        alt={shelter.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <ShelterPlaceholder />
                )}
            </div>
            <div className="px-4 pt-3 pb-4 flex flex-col gap-2 grow">
                <h3 className="font-display font-extrabold text-xl leading-tight transition-colors duration-300 group-hover:text-accent">
                    {/* The ::after overlay makes the whole card clickable;
                        contact links sit above it (z-10). */}
                    <Link
                        href={`/shelters/${shelter.id}`}
                        className="outline-none after:absolute after:inset-0 after:rounded-card"
                    >
                        {shelter.name}
                    </Link>
                </h3>
                {location && (
                    <p className="text-muted text-sm flex items-center gap-1">
                        <PiMapPin className="shrink-0" aria-hidden />
                        <span>{location}</span>
                    </p>
                )}
                {shelter.description && (
                    <p className="text-sm line-clamp-3">
                        {shelter.description}
                    </p>
                )}
                <ul className="relative z-10 flex flex-col gap-2 mt-auto pt-2">
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
                        <ContactLink href={website} icon={<PiGlobe />} external>
                            {websiteLabel}
                        </ContactLink>
                    )}
                </ul>
            </div>
        </article>
    );
}
