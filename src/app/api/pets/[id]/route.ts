import { NextResponse } from 'next/server';
import { getPublicPet } from '@features/pets/queries';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const data = await getPublicPet(id);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 404 });
    }
}
