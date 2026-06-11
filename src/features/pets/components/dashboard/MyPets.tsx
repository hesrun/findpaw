import { Suspense } from 'react';
import MyPetsList from './MyPetsList';
import MyPetsLoader from './MyPetsLoader';

export default async function MyPets({ page }: { page: number }) {
    return (
        <>
            <Suspense key={page} fallback={<MyPetsLoader />}>
                <MyPetsList page={page} />
            </Suspense>
        </>
    );
}
