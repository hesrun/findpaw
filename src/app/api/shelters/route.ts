import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getPublicShelters } from '@features/shelters/queries';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const result = await getPublicShelters(
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
        console.error('GET /api/shelters failed', err);
        return NextResponse.json({ error: 'internal' }, { status: 500 });
    }
}
