import { Skeleton } from '@heroui/react';
import PetCardSkeleton from './PetCardSkeleton';
import { CATALOG_PAGE_SIZE } from '../../constants';

export default function PetsCatalogSkeleton() {
    return (
        <>
            <Skeleton className="h-5 w-24 rounded-lg bg-soft mb-4" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: CATALOG_PAGE_SIZE }).map((_, index) => (
                    <PetCardSkeleton key={index} />
                ))}
            </div>
        </>
    );
}
