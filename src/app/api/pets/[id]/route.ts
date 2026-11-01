import { NextResponse } from 'next/server';
import { getPublicPet } from '@features/pets/queries';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const data = await getPublicPet(id);
        if (!data) {
            return NextResponse.json({ error: 'notFound' }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (err) {
        console.error('GET /api/pets/[id] failed', err);
        return NextResponse.json({ error: 'internal' }, { status: 500 });
    }
}
