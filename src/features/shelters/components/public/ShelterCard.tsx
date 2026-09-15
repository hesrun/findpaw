import { Shelter } from '@types/shelters';
import Image from 'next/image';
import { PiPawPrintThin } from 'react-icons/pi';

export default function ShelterCard({ shelter }: { shelter: Shelter }) {
    return (
        <article className="bg-white rounded-4xl shadow-my relative">
            <a href="">
                <div className="aspect-2/1 bg-background/50 flex items-center justify-center overflow-hidden rounded-t-4xl">
                    {!shelter.image_url || shelter.image_url.length === 0 ? (
                        <PiPawPrintThin className="m-auto text-accent/50 text-[4rem]" />
                    ) : (
                        <Image
                            src={shelter.image_url[0]}
                            alt=""
                            width={300}
                            height={300}
                        />
                    )}
                </div>
                <div className="p-4"></div>
            </a>
        </article>
    );
}
