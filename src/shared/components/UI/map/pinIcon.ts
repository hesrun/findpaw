import { divIcon } from 'leaflet';

// A CSS pin instead of Leaflet's default image icon, which bundlers break.
export const pinIcon = divIcon({
    className: '',
    html: '<span class="block size-6 rounded-full bg-accent ring-4 ring-white shadow-lg"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});
