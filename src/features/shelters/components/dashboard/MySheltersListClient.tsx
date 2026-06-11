import { Database } from '@supabase/database.types';
import MySheltersCard from './MySheltersCard';
import MyPagination from '../../../../shared/components/UI/Pagination';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

export default function MySheltersListClient({
    shelters,
    total,
    currentPage,
    totalPages,
    pageSize,
}: {
    shelters: Database['public']['Tables']['shelters']['Row'][];
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}) {
    const t = useTranslations('dashboard.myShelters');

    return (
        <div className="relative">
            <Link
                href="/dashboard/shelters/add"
                className="absolute -top-16 right-0"
            >
                <Button variant="primary">{t('buttons.addShelter')}</Button>
            </Link>
            <div className="grid gap-3">
                {shelters.map((shelter) => (
                    <MySheltersCard key={shelter.id} shelter={shelter} />
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
        </div>
    );
}
