'use client';

import { Marker } from 'react-leaflet';
import { pinIcon } from '@shared/components/UI/map/pinIcon';
import { usePickerMap } from '@features/pets/hooks/usePickerMap';

type PickerLayerProps = {
    position: [number, number] | null;
    onPick: (lat: number, lng: number) => void;
};

// Lives inside the map: react-leaflet hooks need the MapContainer context.
export default function PickerLayer({ position, onPick }: PickerLayerProps) {
    const { markerHandlers } = usePickerMap(position, onPick);

    return (
        position && (
            <Marker
                position={position}
                icon={pinIcon}
                draggable
                eventHandlers={markerHandlers}
            />
        )
    );
}
