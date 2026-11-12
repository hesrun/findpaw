'use client';

import { useQuery } from '@tanstack/react-query';
import type { getPublicShelters } from './queries';
import type { ShelterFilters } from './schemas';

type PublicSheltersResult = Awaited<ReturnType<typeof getPublicShelters>>;

function createSheltersQueryString(filters: ShelterFilters) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== '') {
            params.set(key, String(value));
        }
    }

    return params.toString();
}

export function usePublicShelters(
    filters: ShelterFilters = {},
    initialData?: PublicSheltersResult,
) {
    return useQuery<PublicSheltersResult>({
        queryKey: ['shelters', 'public', filters],
        initialData,
        staleTime: 30_000,
        queryFn: async () => {
            const queryString = createSheltersQueryString(filters);
            const response = await fetch(
                queryString ? `/api/shelters?${queryString}` : '/api/shelters',
            );

            if (!response.ok) {
                throw new Error('Failed to load public shelters');
            }

            return response.json() as Promise<PublicSheltersResult>;
        },
    });
}
