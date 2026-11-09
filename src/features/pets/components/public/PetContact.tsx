import type { ReactNode } from 'react';
import { PiEnvelopeSimple, PiPhone } from 'react-icons/pi';
import ContactLink from '@features/shelters/components/public/ContactLink';

// Contact card of a listing: the shelter's for shelter pets, the author's
// account contact for private listings. `children` holds extra content such
// as the "Show contact" button.
export default function PetContact({
    title,
    name,
    location,
    phone,
    email,
    children,
}: {
    title: string;
    name?: string | null;
    location?: string;
    phone?: string | null;
    email?: string | null;
    children?: ReactNode;
}) {
    return (
        <section className="bg-surface rounded-card shadow-my ring-1 ring-border p-5">
            <h2 className="font-display font-extrabold text-xl mb-1">
                {title}
            </h2>
            {name && <p className="font-heading font-bold">{name}</p>}
            {location && <p className="text-sm text-muted">{location}</p>}
            {(phone || email) && (
                <ul className="grid gap-2 mt-4">
                    {phone && (
                        <ContactLink href={`tel:${phone}`} icon={<PiPhone />}>
                            {phone}
                        </ContactLink>
                    )}
                    {email && (
                        <ContactLink
                            href={`mailto:${email}`}
                            icon={<PiEnvelopeSimple />}
                        >
                            {email}
                        </ContactLink>
                    )}
                </ul>
            )}
            {children}
        </section>
    );
}
