import { z } from 'zod';
import { MAPY_API_KEY, MAPY_API_URL } from '@shared/constants/map';

// Only the part of the Mapy.com reverse geocoding response we read.
const ReverseGeocodeSchema = z.object({
    items: z.array(
        z.object({
            regionalStructure: z
                .array(z.object({ name: z.string(), type: z.string() }))
                .default([]),
        }),
    ),
});

export type ReverseGeocodeResult = {
    // City, town, or village.
    city: string | null;
    // Street name without a house number: the exact address of a private
    // person should not be filled in for them.
    street: string | null;
};

// City and street at a map point, or null when the request fails.
// Each call counts against the Mapy.com quota, so call it once per
// confirmed point, not on every click.
export async function reverseGeocode(
    lat: number,
    lng: number,
    lang: string,
): Promise<ReverseGeocodeResult | null> {
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        lang,
        apikey: MAPY_API_KEY,
    });

    try {
        const response = await fetch(`${MAPY_API_URL}/rgeocode?${params}`);
        if (!response.ok) return null;

        const parsed = ReverseGeocodeSchema.safeParse(await response.json());
        if (!parsed.success) return null;

        const parts = parsed.data.items.flatMap(
            (item) => item.regionalStructure,
        );
        const nameOf = (type: string) =>
            parts.find((part) => part.type === type)?.name ?? null;

        return {
            city: nameOf('regional.municipality'),
            street: nameOf('regional.street'),
        };
    } catch {
        return null;
    }
}
