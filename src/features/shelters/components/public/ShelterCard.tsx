import type { ReactNode } from 'react';
import type { Shelter } from '@/types/shelters';
import Image from 'next/image';
import { isHttpUrl } from '@shared/lib/url';
import { PiEnvelopeSimple, PiGlobe, PiMapPin, PiPhone } from 'react-icons/pi';
import { ShelterPlaceholder } from '@UI/PetPlaceholder';

function ContactLink({
    href,
    icon,
    children,
    external,
}: {
    href: string;
    icon: ReactNode;
    children: ReactNode;
    external?: boolean;
}) {
    return (
        <li>
            <a
                href={href}
                {...(external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                })}
                className="group flex items-center gap-2 text-sm min-w-0"
            >
                <span
                    className="w-8 h-8 shrink-0 rounded-full bg-soft text-accent flex items-center justify-center text-base transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
                    aria-hidden
                >
                    {icon}
                </span>
                <span className="truncate transition-colors duration-300 group-hover:text-accent">
                    {children}
                </span>
            </a>
        </li>
    );
}

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
        <article className="bg-surface rounded-card shadow-my ring-1 ring-border h-full flex flex-col">
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
                <h3 className="font-display font-extrabold text-xl leading-tight">
                    {shelter.name}
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
                <ul className="flex flex-col gap-2 mt-auto pt-2">
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
