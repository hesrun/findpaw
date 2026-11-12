'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { getPetOwnerContact } from '../queries';

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
