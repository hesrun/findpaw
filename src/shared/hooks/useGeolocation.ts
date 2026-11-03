'use client';

import { useState } from 'react';

// Asks the browser for the current position once per `locate` call.
// `onError` runs when geolocation is unsupported or the user denies it.
export function useGeolocation({
    onLocate,
    onError,
}: {
    onLocate: (lat: number, lng: number) => void;
    onError: () => void;
}) {
    const [isLocating, setIsLocating] = useState(false);

    function locate() {
        if (!('geolocation' in navigator)) {
            onError();
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setIsLocating(false);
                onLocate(coords.latitude, coords.longitude);
            },
            () => {
                setIsLocating(false);
                onError();
            },
        );
    }

    return { locate, isLocating };
}
