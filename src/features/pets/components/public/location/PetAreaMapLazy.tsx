'use client';

import dynamic from 'next/dynamic';

// `ssr: false` is allowed only in client components, so the server-rendered
// pet page loads the map through this wrapper.
const PetAreaMapLazy = dynamic(() => import('./PetAreaMap'), {
    ssr: false,
    loading: () => <div className="h-72 rounded-media bg-soft animate-pulse" />,
});

export default PetAreaMapLazy;
