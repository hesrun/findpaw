import { Skeleton } from '@heroui/react';
import { SHELTER_CATALOG_PAGE_SIZE } from '../../constants';
import ShelterCardSkeleton from './ShelterCardSkeleton';

export default function SheltersCatalogSkeleton() {
    return (
        <>
            <Skeleton className="h-5 w-24 rounded-lg bg-soft mb-4" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: SHELTER_CATALOG_PAGE_SIZE }).map(
                    (_, index) => (
                        <ShelterCardSkeleton key={index} />
                    ),
                )}
            </div>
        </>
    );
}
