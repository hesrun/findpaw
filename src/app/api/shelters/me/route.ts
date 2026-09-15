import { NextResponse } from 'next/server';
import { getMyShelters } from '../../../../features/shelters/queries';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page') || '1');
        const pageSize = Number(url.searchParams.get('pageSize') || '20');

        const result = await getMyShelters(page, pageSize);
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 401 });
    }
}
