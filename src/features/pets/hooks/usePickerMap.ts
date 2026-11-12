'use client';

import { useEffect } from 'react';
import type { LeafletEvent, Marker } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { PET_LOCATION_ZOOM } from '@features/pets/constants';

// Map-side behavior of the location picker: a click places the point, the
// marker can be dragged, and the view follows a point set from outside
// (for example "Use my location"). Must run inside a MapContainer.
export function usePickerMap(
    position: [number, number] | null,
    onPick: (lat: number, lng: number) => void,
) {
    const map = useMap();

    useMapEvents({
        click: ({ latlng }) => onPick(latlng.lat, latlng.lng),
    });

    useEffect(() => {
        if (position && !map.getBounds().contains(position)) {
            map.flyTo(position, Math.max(map.getZoom(), PET_LOCATION_ZOOM));
        }
    }, [map, position]);

    const markerHandlers = {
        dragend: (event: LeafletEvent) => {
            const { lat, lng } = (event.target as Marker).getLatLng();
            onPick(lat, lng);
        },
    };

    return { markerHandlers };
}
