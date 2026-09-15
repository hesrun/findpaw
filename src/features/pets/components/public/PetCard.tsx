import { PetWithShelter } from '@/types/pets';
import Image from 'next/image';
import { PiPawPrintThin } from 'react-icons/pi';
import { formatAge } from '@/shared/helpers/ageFormat';
import ListingChip from '@/shared/components/UI/ListingChips';
import { getTranslations } from 'next-intl/server';
import SexIcon from '@UI/SexIcon';
import { TbHomeShield } from 'react-icons/tb';

export default async function PetCard({ pet }: { pet: PetWithShelter }) {
    const translations = await getTranslations('pets');
    const ageFormat = await formatAge(pet.age_months, 'short');

    return (
        <article className="bg-white rounded-4xl shadow-my relative">
            <a href="">
                <div className="aspect-2/1 bg-background/50 flex items-center justify-center overflow-hidden rounded-t-4xl">
                    {!pet.image_url || pet.image_url.length === 0 ? (
                        <PiPawPrintThin className="m-auto text-accent/50 text-[4rem]" />
                    ) : (
                        <Image
                            src={pet.image_url[0]}
                            alt=""
                            width={300}
                            height={300}
                        />
                    )}
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading font-bold">{pet.name}</h3>
                    </div>
                    <div className="text-muted flex gap-2 flex-wrap text-sm">
                        {pet.breed && <span>{pet.breed}</span>}
                        {pet.age_months && <span>{ageFormat}</span>}
                        {pet.city && <span>{pet.city}</span>}
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    {pet.sex && <SexIcon sex={pet.sex} />}
                </div>
                <div className="absolute top-4 left-4">
                    <ListingChip
                        label={translations(`listingType.${pet.listing_type}`)}
                        type={pet.listing_type}
                    />
                </div>
            </a>
        </article>
    );
}
