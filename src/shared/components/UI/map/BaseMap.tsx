'use client';

import 'leaflet/dist/leaflet.css';
import type { ReactNode } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useLocale } from 'next-intl';
import clsx from 'clsx';
import {
    MAPY_API_KEY,
    MAPY_ATTRIBUTION,
    MAPY_TILE_URL,
    MAP_MAX_ZOOM,
} from '@shared/constants/map';
import MapSetup from './MapSetup';

// Leaflet touches `window` on import: load maps with next/dynamic and
// `ssr: false` from a client component. `isolate` keeps Leaflet's z-indexes
// (up to 1000) from covering headers, drawers, and popovers.
export default function BaseMap({
    center,
    zoom,
    className,
    scrollWheelZoom = true,
    children,
}: {
    center: [number, number];
    zoom: number;
    className?: string;
    scrollWheelZoom?: boolean;
    children?: ReactNode;
}) {
    const locale = useLocale();

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            maxZoom={MAP_MAX_ZOOM}
            scrollWheelZoom={scrollWheelZoom}
            className={clsx('isolate rounded-media z-0', className)}
        >
            <TileLayer
                url={`${MAPY_TILE_URL}?lang=${locale}&apikey=${MAPY_API_KEY}`}
                attribution={MAPY_ATTRIBUTION}
                maxZoom={MAP_MAX_ZOOM}
            />
            <MapSetup />
            {children}
        </MapContainer>
    );
}
