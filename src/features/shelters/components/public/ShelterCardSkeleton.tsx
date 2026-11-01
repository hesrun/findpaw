import { Skeleton } from '@heroui/react';

export default function ShelterCardSkeleton() {
    return (
        <div className="bg-white rounded-4xl shadow-my">
            <div className="aspect-2/1 overflow-hidden rounded-t-4xl">
                <Skeleton className="h-full rounded-lg bg-background/50" />
            </div>
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/5 rounded-lg bg-accent/10" />
                <Skeleton className="h-3 w-2/5 rounded-lg bg-accent/10" />
                <Skeleton className="h-3 w-full rounded-lg bg-accent/10" />
                <Skeleton className="h-3 w-4/5 rounded-lg bg-accent/10" />
            </div>
        </div>
    );
}
