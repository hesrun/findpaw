'use client';

import { useMapAutoResize } from './hooks/useMapAutoResize';
import { useMapyLogo } from './hooks/useMapyLogo';

// Behavior every map needs; rendered inside MapContainer for its context.
export default function MapSetup() {
    useMapyLogo();
    useMapAutoResize();
    return null;
}
