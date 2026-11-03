'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Leaflet measures its container once. A map that appears inside an
// animating modal or a resized layout shows grey tiles until it re-measures,
// so re-measure whenever the container size changes.
export function useMapAutoResize() {
    const map = useMap();

    useEffect(() => {
        const observer = new ResizeObserver(() => map.invalidateSize());
        observer.observe(map.getContainer());
        return () => observer.disconnect();
    }, [map]);
}
