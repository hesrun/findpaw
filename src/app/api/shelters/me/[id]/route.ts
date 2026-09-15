import { NextResponse } from 'next/server';
import { getMyShelter } from '@features/shelters/queries';

export async function GET(req: Request, { params }: { params: any }) {
    try {
        const { id } = await params;
        const data = await getMyShelter(id);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 404 });
    }
}
