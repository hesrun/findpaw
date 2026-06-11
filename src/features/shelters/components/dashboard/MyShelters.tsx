import { Suspense } from 'react';
import MySheltersList from './MySheltersList';
import MyPetsLoader from '@/features/pets/components/dashboard/MyPetsLoader';

export default function MyShelters({ page }: { page: number }) {
    return (
        <Suspense key={page} fallback={<MyPetsLoader />}>
            <MySheltersList page={page} />
        </Suspense>
    );
}
