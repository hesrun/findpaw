import { Skeleton } from '@heroui/react';

export default function ShelterCardSkeleton() {
    return (
        <div className="bg-surface rounded-card shadow-my ring-1 ring-border">
            <div className="m-2 mb-0 aspect-2/1 overflow-hidden rounded-media">
                <Skeleton className="h-full rounded-media bg-soft" />
            </div>
            <div className="px-4 pt-3 pb-4 space-y-3">
                <Skeleton className="h-4 w-3/5 rounded-lg bg-soft" />
                <Skeleton className="h-3 w-2/5 rounded-lg bg-soft" />
                <Skeleton className="h-3 w-full rounded-lg bg-soft" />
                <Skeleton className="h-3 w-4/5 rounded-lg bg-soft" />
            </div>
        </div>
    );
}
