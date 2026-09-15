import { getMyShelters } from '../../queries';
import MySheltersEmpty from './MySheltersEmpty';
import MySheltersListClient from './MySheltersListClient';

export default async function MySheltersList({ page }: { page: number }) {
    const pageSize = 20;
    const { data: shelters, total } = await getMyShelters(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return (
        <>
            {shelters.length === 0 && <MySheltersEmpty />}
            {shelters.length > 0 && (
                <MySheltersListClient
                    shelters={shelters}
                    total={total}
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                />
            )}
        </>
    );
}
