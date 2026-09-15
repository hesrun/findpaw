import { NextResponse } from 'next/server';
import { getMyPet } from '@features/pets/queries';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const data = await getMyPet(id);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 404 });
    }
}
