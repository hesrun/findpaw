'use client';

import { useEffect } from 'react';
import { Control, DomUtil } from 'leaflet';
import { useMap } from 'react-leaflet';
import { MAPY_HOME_URL, MAPY_LOGO_URL } from '@shared/constants/map';

// Adds the Mapy.com logo control; the Mapy.com terms require it on every map
// that uses their tiles. Must run inside a react-leaflet MapContainer.
export function useMapyLogo() {
    const map = useMap();

    useEffect(() => {
        const logo = new Control({ position: 'bottomleft' });
        logo.onAdd = () => {
            const link = DomUtil.create('a');
            link.href = MAPY_HOME_URL;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            const image = DomUtil.create('img', '', link);
            image.src = MAPY_LOGO_URL;
            image.alt = 'Mapy.com';
            image.width = 100;
            return link;
        };
        logo.addTo(map);
        return () => {
            logo.remove();
        };
    }, [map]);
}
