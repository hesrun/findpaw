import { NextResponse } from 'next/server';
import { getPublicShelter } from '@features/shelters/queries';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const data = await getPublicShelter(id);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 404 });
    }
}
