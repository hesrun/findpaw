'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PetFilters } from './schemas';
import type { getPetOwnerContact, getPublicPets } from './queries';

type PublicPetsResult = Awaited<ReturnType<typeof getPublicPets>>;
type PetOwnerContact = NonNullable<
    Awaited<ReturnType<typeof getPetOwnerContact>>
>;

// The author's contact is loaded only after `reveal()`, so it never ships in
// the page HTML.
export function usePetOwnerContact(petId: string) {
    const [isRevealed, setIsRevealed] = useState(false);
    const query = useQuery<PetOwnerContact>({
        queryKey: ['pets', 'contact', petId],
        enabled: isRevealed,
        staleTime: Infinity,
        retry: false,
        queryFn: async () => {
            const response = await fetch(`/api/pets/${petId}/contact`);

            if (!response.ok) {
                throw new Error('Failed to load the pet contact');
            }

            return response.json() as Promise<PetOwnerContact>;
        },
    });

    return {
        contact: query.data,
        isRevealed,
        isLoading: query.isFetching,
        isError: query.isError,
        reveal: () => setIsRevealed(true),
    };
}

function createPetsQueryString(filters: PetFilters) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== '') {
            params.set(key, String(value));
        }
    }

    return params.toString();
}

export function usePublicPets(
    filters: PetFilters = {},
    initialData?: PublicPetsResult,
) {
    return useQuery<PublicPetsResult>({
        queryKey: ['pets', 'public', filters],
        initialData,
        staleTime: 30_000,
        queryFn: async () => {
            const queryString = createPetsQueryString(filters);
            const response = await fetch(
                queryString ? `/api/pets?${queryString}` : '/api/pets',
            );

            if (!response.ok) {
                throw new Error('Failed to load public pets');
            }

            return response.json() as Promise<PublicPetsResult>;
        },
    });
}
