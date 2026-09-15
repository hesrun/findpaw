import { getMyPets } from '../../queries';
import MyPetsEmpty from './MyPetsEmpty';
import MyPetsListClient from './MyPetsListClient';

export default async function MyPetsList({ page }: { page: number }) {
    const pageSize = 20;
    const { data: pets, total } = await getMyPets(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return (
        <>
            {pets.length === 0 && <MyPetsEmpty />}
            {pets.length > 0 && (
                <MyPetsListClient
                    pets={pets}
                    total={total}
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                />
            )}
        </>
    );
}
