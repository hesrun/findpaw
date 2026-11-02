import { NextResponse } from 'next/server';
import { getPublicShelter } from '@features/shelters/queries';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const data = await getPublicShelter(id);

        if (!data) {
            return NextResponse.json({ error: 'notFound' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('GET /api/shelters/[id] failed', err);
        return NextResponse.json({ error: 'internal' }, { status: 500 });
    }
}
