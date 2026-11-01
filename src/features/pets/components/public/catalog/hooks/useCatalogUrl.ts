'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useDebouncedCallback } from '@shared/hooks/useDebouncedCallback';
import {
    CATALOG_PRICE_KEYS,
    CATALOG_PRICED_LISTING_TYPE,
    CATALOG_TEXT_DEBOUNCE_MS,
    CATALOG_TEXT_FILTER_KEYS,
    type CatalogTextKey,
} from '@features/pets/constants';
import { PetFiltersSchema, type PetFilters } from '@features/pets/schemas';

// Every key here is a URL query parameter read by the catalog page.
export type CatalogFilterKey = Exclude<keyof PetFilters, 'pageSize'>;
export type CatalogParamChanges = Partial<
    Record<CatalogFilterKey, string | null>
>;
export type CatalogTextValues = Record<CatalogTextKey, string>;

const SORT_PARAMS = ['sortBy', 'ascending'] as const;

function readText(params: URLSearchParams): CatalogTextValues {
    return Object.fromEntries(
        CATALOG_TEXT_FILTER_KEYS.map((key) => [key, params.get(key) ?? '']),
    ) as CatalogTextValues;
}

// The single owner of the catalog URL. Filters, search and sort all write
// through `navigate`, so a pending debounced text change is never lost when
// another control changes the URL first.
export function useCatalogUrl() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Same parsing as the server page, so invalid values are ignored here too.
    const filters: PetFilters =
        PetFiltersSchema.safeParse(Object.fromEntries(searchParams)).data ?? {};

    // Text fields keep local state so typing stays responsive; the URL is
    // updated after a short pause. The ref mirrors the state so every
    // navigation (debounced or not) carries the latest typed values.
    const [text, setTextState] = useState<CatalogTextValues>(() =>
        readText(searchParams),
    );
    const textRef = useRef(text);
    const debouncedNavigate = useDebouncedCallback(
        () => navigate(),
        CATALOG_TEXT_DEBOUNCE_MS,
    );

    function setText(changes: Partial<CatalogTextValues>) {
        textRef.current = { ...textRef.current, ...changes };
        setTextState(textRef.current);
    }

    function replace(params: URLSearchParams) {
        const query = params.toString();
        startTransition(() => {
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        });
    }

    function navigate(changes: CatalogParamChanges = {}) {
        debouncedNavigate.cancel();
        const params = new URLSearchParams(searchParams.toString());
        const textChanges = Object.fromEntries(
            CATALOG_TEXT_FILTER_KEYS.map((key) => [
                key,
                textRef.current[key].trim() || null,
            ]),
        );
        for (const [key, value] of Object.entries({
            ...textChanges,
            ...changes,
        })) {
            if (value) params.set(key, value);
            else params.delete(key);
        }
        // Any filter change starts again from the first page.
        params.delete('page');
        replace(params);
    }

    function changeText(key: CatalogTextKey, value: string) {
        setText({ [key]: value });
        debouncedNavigate.run();
    }

    function clearText(keys: readonly CatalogTextKey[]) {
        setText(Object.fromEntries(keys.map((key) => [key, ''])));
    }

    function changeListingType(id: string | null) {
        // Price only applies to one listing type; drop it when leaving it.
        if (id !== CATALOG_PRICED_LISTING_TYPE) clearText(CATALOG_PRICE_KEYS);
        navigate({ listing_type: id });
    }

    // Clears every filter but keeps the chosen sort order.
    function reset() {
        debouncedNavigate.cancel();
        clearText(CATALOG_TEXT_FILTER_KEYS);
        const params = new URLSearchParams();
        for (const key of SORT_PARAMS) {
            const value = searchParams.get(key);
            if (value) params.set(key, value);
        }
        replace(params);
    }

    return {
        filters,
        text,
        isPending,
        navigate,
        changeText,
        clearText,
        changeListingType,
        reset,
    };
}

export type CatalogUrlState = ReturnType<typeof useCatalogUrl>;
