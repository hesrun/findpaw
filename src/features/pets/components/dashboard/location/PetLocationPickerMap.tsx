'use client';

import BaseMap from '@shared/components/UI/map/BaseMap';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '@shared/constants/map';
import { PET_LOCATION_ZOOM } from '@features/pets/constants';
import PickerLayer from './PickerLayer';

type PetLocationPickerMapProps = {
    position: [number, number] | null;
    onPick: (lat: number, lng: number) => void;
};

// Loaded with next/dynamic and ssr: false (Leaflet needs `window`).
export default function PetLocationPickerMap({
    position,
    onPick,
}: PetLocationPickerMapProps) {
    return (
        <BaseMap
            center={position ?? MAP_DEFAULT_CENTER}
            zoom={position ? PET_LOCATION_ZOOM : MAP_DEFAULT_ZOOM}
            className="h-[60vh] min-h-80 w-full cursor-crosshair"
        >
            <PickerLayer position={position} onPick={onPick} />
        </BaseMap>
    );
}
