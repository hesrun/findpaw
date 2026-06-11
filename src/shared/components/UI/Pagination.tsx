'use client';

import { Pagination } from '@heroui/react';
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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Pagination className="w-full">
            <Pagination.Summary>
                Showing {startItem}-{endItem} of {total} results
            </Pagination.Summary>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous
                        isDisabled={currentPage === 1}
                        onPress={() => handlePageChange(currentPage - 1)}
                    >
                        <Pagination.PreviousIcon />
                        <span>Prev</span>
                    </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Item>
                    <Pagination.Next
                        isDisabled={currentPage === totalPages}
                        onPress={() => handlePageChange(currentPage + 1)}
                    >
                        <span>Next</span>
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
}
