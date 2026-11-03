'use client';

import { Circle } from 'react-leaflet';
import BaseMap from '@shared/components/UI/map/BaseMap';
import {
    PET_LOCATION_PUBLIC_RADIUS_M,
    PET_LOCATION_ZOOM,
} from '@features/pets/constants';

// Loaded with next/dynamic and ssr: false (Leaflet needs `window`).
// Shows an area, not a pin: the saved point is only approximate.
export default function PetAreaMap({ lat, lng }: { lat: number; lng: number }) {
    return (
        <BaseMap
            center={[lat, lng]}
            zoom={PET_LOCATION_ZOOM}
            scrollWheelZoom={false}
            className="h-72 w-full"
        >
            <Circle
                center={[lat, lng]}
                radius={PET_LOCATION_PUBLIC_RADIUS_M}
                // SVG presentation attributes cannot read CSS variables, so
                // the theme color comes from classes, which win over them.
                pathOptions={{
                    className: 'stroke-accent fill-accent',
                    fillOpacity: 0.2,
                    weight: 2,
                }}
            />
        </BaseMap>
    );
}
