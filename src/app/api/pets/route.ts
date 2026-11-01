import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getPublicPets } from '@features/pets/queries';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const result = await getPublicPets(
            Object.fromEntries(url.searchParams.entries()),
        );
        return NextResponse.json(result);
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: 'invalidFilters' },
                { status: 400 },
            );
        }
        console.error('GET /api/pets failed', err);
        return NextResponse.json({ error: 'internal' }, { status: 500 });
    }
}
