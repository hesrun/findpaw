import { Card, Skeleton } from '@heroui/react';

export default function MyPetsLoader() {
    return (
        <div className="grid gap-3">
            {[...Array(6)].map((_, index) => (
                <MyPetLoaderCard key={index} />
            ))}
        </div>
    );
}

function MyPetLoaderCard() {
    return (
        <Card>
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                <Skeleton className="w-12 aspect-square rounded-full" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg ml-auto" />
                <Skeleton className="h-3 w-10 rounded-lg" />
            </div>
        </Card>
    );
}
