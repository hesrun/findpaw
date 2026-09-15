import FeaturedPets from '@features/pets/components/public/FeaturedPets';
import { getPublicPets } from '@features/pets/queries';

export default async function PetsSection() {
    const { data: pets } = await getPublicPets({
        page: 1,
        pageSize: 4,
        sortBy: 'created_at',
        ascending: false,
    });
    return (
        <section>
            <div className="container">
                <h2>Recently added pets</h2>
                <div className="container mx-auto px-4">dfgsdfg</div>
                {pets && pets.length > 0 && <FeaturedPets pets={pets} />}
            </div>
        </section>
    );
}
