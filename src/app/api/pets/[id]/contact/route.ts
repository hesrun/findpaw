import { NextResponse } from 'next/server';
import { getPetOwnerContact } from '@features/pets/queries';
import { PetIdSchema } from '@features/pets/schemas';

// Author contact of a private listing, fetched only when a visitor clicks
// "Show contact", so it is not in the page HTML. /api/ is disallowed in robots.txt.
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const headers = { 'Cache-Control': 'no-store' };
    try {
        const id = PetIdSchema.safeParse((await params).id);
        const data = id.success ? await getPetOwnerContact(id.data) : null;
        if (!data) {
            return NextResponse.json(
                { error: 'notFound' },
                { status: 404, headers },
            );
        }
        return NextResponse.json(data, { headers });
    } catch (err) {
        console.error('GET /api/pets/[id]/contact failed', err);
        return NextResponse.json({ error: 'internal' }, { status: 500, headers });
    }
}
