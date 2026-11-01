import { useTranslations } from 'next-intl';
import type { Shelter } from '@/types/shelters';
import Image from 'next/image';
import { isHttpUrl } from '@shared/lib/url';
import {
    PiEnvelopeSimple,
    PiGlobe,
    PiMapPin,
    PiPawPrintThin,
    PiPhone,
} from 'react-icons/pi';

const CONTACT_LINK_CLASS =
    'w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg transition-colors duration-300 hover:bg-accent hover:text-white';

export default function ShelterCard({ shelter }: { shelter: Shelter }) {
    const t = useTranslations('shelterCard');
    const location = [shelter.city, shelter.address].filter(Boolean).join(', ');
    const image = shelter.img_url?.[0];
    // Also checked on save; re-checked here for rows written outside the form.
    const website =
        shelter.website && isHttpUrl(shelter.website) ? shelter.website : null;

    return (
        <article className="bg-white rounded-4xl shadow-my h-full flex flex-col">
            <div className="relative aspect-2/1 bg-background/50 flex items-center justify-center overflow-hidden rounded-t-4xl">
                {image ? (
                    <Image
                        src={image}
                        alt={shelter.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <PiPawPrintThin className="m-auto text-accent/50 text-[4rem]" />
                )}
            </div>
            <div className="p-4 flex flex-col gap-2 grow">
                <h3 className="font-heading font-bold text-lg">
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
                <div className="flex gap-2 mt-auto pt-2">
                    {shelter.phone && (
                        <a
                            href={`tel:${shelter.phone}`}
                            className={CONTACT_LINK_CLASS}
                            aria-label={t('call', { phone: shelter.phone })}
                            title={shelter.phone}
                        >
                            <PiPhone aria-hidden />
                        </a>
                    )}
                    {shelter.email && (
                        <a
                            href={`mailto:${shelter.email}`}
                            className={CONTACT_LINK_CLASS}
                            aria-label={t('email', { email: shelter.email })}
                            title={shelter.email}
                        >
                            <PiEnvelopeSimple aria-hidden />
                        </a>
                    )}
                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={CONTACT_LINK_CLASS}
                            aria-label={t('website')}
                            title={website}
                        >
                            <PiGlobe aria-hidden />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
