import { PetWithShelter } from '@/types/pets';
import PetCard from './PetCard';

export default function FeaturedPets({ pets }: { pets: PetWithShelter[] }) {
    return (
        <ul className="grid grid-cols-4 gap-4">
            {pets.map((pet) => (
                <li key={pet.id}>
                    <PetCard key={pet.id} pet={pet} />
                </li>
            ))}
        </ul>
    );
}
