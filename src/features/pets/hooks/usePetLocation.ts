'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from '@heroui/react';
import { MAPY_API_KEY } from '@shared/constants/map';
import { reverseGeocode } from '@shared/lib/mapy';
import { useGeolocation } from '@shared/hooks/useGeolocation';
import { LISTING_TYPES } from '@features/pets/constants';
import type { Pet } from '@/types/pets';

type LatLng = [number, number];

function initialPosition(
    initial?: Pick<Pet, 'latitude' | 'longitude'>,
): LatLng | null {
    return initial?.latitude != null && initial.longitude != null
        ? [initial.latitude, initial.longitude]
        : null;
}

// Owns the pet form's location: city and address text and the map point.
// The map modal edits a draft; only "Confirm" saves it as the point and
// fills city and street from Mapy.com, one geocoding request per confirm.
export function usePetLocation(
    initial:
        | Pick<Pet, 'latitude' | 'longitude' | 'city' | 'address'>
        | undefined,
    listingType: string | null,
) {
    const locale = useLocale();
    const t = useTranslations('dashboard.myPets.fields');
    const [city, setCity] = useState(initial?.city ?? '');
    const [address, setAddress] = useState(initial?.address ?? '');
    const [position, setPosition] = useState(() => initialPosition(initial));
    const [draft, setDraft] = useState<LatLng | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const titleKey =
        LISTING_TYPES.find(({ id }) => id === listingType)?.id ?? 'default';
    // Only the latest lookup may fill the fields.
    const lookupRef = useRef(0);

    const geolocation = useGeolocation({
        onLocate: (lat, lng) => setDraft([lat, lng]),
        onError: () => toast.danger(t('mapLocationError')),
    });

    function openModal() {
        setDraft(position);
        setIsModalOpen(true);
    }

    async function confirm() {
        setIsModalOpen(false);
        if (!draft) return;
        setPosition(draft);
        const lookup = ++lookupRef.current;
        const place = await reverseGeocode(draft[0], draft[1], locale);
        if (!place || lookup !== lookupRef.current) return;
        if (place.city) setCity(place.city);
        if (place.street) setAddress(place.street);
    }

    function clear() {
        lookupRef.current += 1;
        setPosition(null);
    }

    return {
        city,
        setCity,
        address,
        setAddress,
        position,
        clear,
        hasMap: !!MAPY_API_KEY,
        modal: {
            title: t(`mapPoint.${titleKey}`),
            isOpen: isModalOpen,
            setIsOpen: setIsModalOpen,
            open: openModal,
            draft,
            pick: (lat: number, lng: number) => setDraft([lat, lng]),
            confirm,
            locate: geolocation.locate,
            isLocating: geolocation.isLocating,
        },
    };
}
