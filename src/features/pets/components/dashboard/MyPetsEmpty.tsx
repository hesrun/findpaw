import { Button } from '@heroui/react';
import Link from 'next/link';
import { MdPets } from 'react-icons/md';
import { getTranslations } from 'next-intl/server';

export default async function MyPetsEmpty() {
    const t = await getTranslations('dashboard.myPets');
    return (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-accent bg-white rounded-[2rem] w-60 mx-auto aspect-square flex flex-col items-center justify-center">
            <MdPets className="mx-auto text-4xl mb-4" />
            <h2 className="text-2xl font-extrabold mb-4 font-display px-4 leading-none">
                {t('emptyState.title')}
            </h2>
            <Link href="/dashboard/pets/add">
                <Button variant="primary">{t('emptyState.btn')}</Button>
            </Link>
        </div>
    );
}
