import { NextResponse } from 'next/server';
import { getMyPets } from '@features/pets/queries';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page') || '1');
        const pageSize = Number(url.searchParams.get('pageSize') || '20');

        const result = await getMyPets(page, pageSize);
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 401 });
    }
}
