'use client';

import { Button } from '@heroui/react';
import MyPetsCard from './MyPetsCard';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import MyPetsDetailModal from './myPetsDetailModal';
import MyPagination from '@shared/components/UI/Pagination';
import type { PetWithShelter } from '../../../../types/pets';

export default function MyPetsListClient({
    pets,
    total,
    currentPage,
    totalPages,
    pageSize,
}: {
    pets: PetWithShelter[];
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}) {
    const t = useTranslations('dashboard.myPets');
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectedPet, setSelectedPet] = useState<PetWithShelter | null>(null);

    return (
        <div className="relative">
            <Link
                href="/dashboard/pets/add"
                className="absolute -top-16 right-0"
            >
                <Button variant="primary">{t('buttons.addPet')}</Button>
            </Link>
            <div className="grid gap-3">
                {pets.map((pet) => (
                    <MyPetsCard
                        key={pet.id}
                        pet={pet}
                        setSelectedPet={setSelectedPet}
                        setIsModalOpen={setIsModalOpen}
                    />
                ))}
            </div>
            <div className="mt-6">
                <MyPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    pageSize={pageSize}
                />
            </div>
            {selectedPet && (
                <MyPetsDetailModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedPet={selectedPet}
                />
            )}
        </div>
    );
}
