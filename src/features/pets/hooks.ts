'use client';

import { useQuery } from '@tanstack/react-query';
import type { PetFilters } from './schemas';
import type { getPublicPets } from './queries';

type PublicPetsResult = Awaited<ReturnType<typeof getPublicPets>>;

function createPetsQueryString(filters: PetFilters) {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== '') {
			params.set(key, String(value));
		}
	}

	return params.toString();
}

export function usePublicPets(filters: PetFilters = {}) {
	return useQuery<PublicPetsResult>({
		queryKey: ['pets', 'public', filters],
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
