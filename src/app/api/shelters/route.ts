import { NextResponse } from 'next/server';
import { getPublicShelters } from '../../../features/shelters/queries';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const result = await getPublicShelters(
            Object.fromEntries(url.searchParams.entries()),
        );
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 400 });
    }
}
