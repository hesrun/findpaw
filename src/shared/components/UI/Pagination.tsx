'use client';

import { Pagination } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function MyPagination({
    currentPage,
    totalPages,
    total,
    pageSize,
}: {
    currentPage: number;
    totalPages: number;
    total: number;
    pageSize: number;
}) {
    const t = useTranslations('global.pagination');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const startItem = Math.min((currentPage - 1) * pageSize + 1, total);
    const endItem = Math.min(currentPage * pageSize, total);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Pagination className="w-full">
            <Pagination.Summary>
                {t('summary', {
                    start: startItem,
                    end: endItem,
                    total,
                })}
            </Pagination.Summary>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous
                        isDisabled={currentPage === 1}
                        onPress={() => handlePageChange(currentPage - 1)}
                    >
                        <Pagination.PreviousIcon />
                        <span>{t('prev')}</span>
                    </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Item>
                    <Pagination.Next
                        isDisabled={currentPage >= totalPages}
                        onPress={() => handlePageChange(currentPage + 1)}
                    >
                        <span>{t('next')}</span>
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
}
