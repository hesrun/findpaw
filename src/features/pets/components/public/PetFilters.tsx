'use client';

import {
    Button,
    Drawer,
    Input,
    Label,
    ListBox,
    Select,
    Switch,
    TextField,
} from '@heroui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition, type ReactNode } from 'react';
import { LuSearch, LuSlidersHorizontal, LuX } from 'react-icons/lu';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
    LISTING_TYPES,
    PET_AGE_GROUPS,
    SEX_OPTIONS,
    SPECIES,
} from '../../constants';
import {
    PetFiltersSchema,
    type PetFilters as PetFiltersValue,
} from '../../schemas';

// Every key here is a URL query parameter read by the catalog page.
type FilterKey = Exclude<keyof PetFiltersValue, 'pageSize'>;

const SORT_OPTIONS = {
    newest: { sortBy: 'created_at', ascending: false },
    oldest: { sortBy: 'created_at', ascending: true },
    priceAsc: { sortBy: 'price', ascending: true },
    priceDesc: { sortBy: 'price', ascending: false },
    youngest: { sortBy: 'age_months', ascending: true },
    oldestPet: { sortBy: 'age_months', ascending: false },
} satisfies Record<
    string,
    {
        sortBy: NonNullable<PetFiltersValue['sortBy']>;
        ascending: boolean;
    }
>;
type SortKey = keyof typeof SORT_OPTIONS;

const TEXT_KEYS = ['q', 'city', 'breed', 'min_price', 'max_price'] as const;
type TextKey = (typeof TEXT_KEYS)[number];
type TextValues = Record<TextKey, string>;

const FLAG_KEYS = ['from_shelter', 'vaccinated', 'sterilized'] as const;
type FlagKey = (typeof FLAG_KEYS)[number];

const FLAG_LABEL_KEYS = {
    from_shelter: 'fromShelter',
    vaccinated: 'vaccinated',
    sterilized: 'sterilized',
} as const satisfies Record<FlagKey, string>;

// "unknown" is a data-entry fallback, not something people search for.
const SEX_FILTER_OPTIONS = SEX_OPTIONS.filter(({ id }) => id !== 'unknown');

function readText(params: URLSearchParams): TextValues {
    return Object.fromEntries(
        TEXT_KEYS.map((key) => [key, params.get(key) ?? '']),
    ) as TextValues;
}

const ALL = 'all';
const TEXT_DEBOUNCE_MS = 400;

const PILL_BASE_CLASS =
    'px-3.5 py-1.5 rounded-full text-sm font-heading font-bold transition-colors duration-300 cursor-pointer';
const PILL_ACTIVE_CLASS =
    'bg-accent text-accent-foreground shadow-[0_8px_18px_-8px_color-mix(in_oklch,var(--accent)_55%,transparent)]';
const PILL_INACTIVE_CLASS =
    'bg-surface text-muted ring-1 ring-border hover:text-accent';

function pillClass(isActive: boolean) {
    return clsx(
        PILL_BASE_CLASS,
        isActive ? PILL_ACTIVE_CLASS : PILL_INACTIVE_CLASS,
    );
}

function getSortKey(sortBy: string | null, ascending: string | null): SortKey {
    const isAscending = ascending === 'true';
    const match = (Object.keys(SORT_OPTIONS) as SortKey[]).find(
        (key) =>
            SORT_OPTIONS[key].sortBy === (sortBy ?? 'created_at') &&
            SORT_OPTIONS[key].ascending === isAscending,
    );
    return match ?? 'newest';
}

function FilterGroup({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <fieldset className="grid gap-2">
            <legend className="text-sm font-heading font-bold mb-2">
                {label}
            </legend>
            {children}
        </fieldset>
    );
}

export default function PetFilters({ children }: { children: ReactNode }) {
    const t = useTranslations('petsPage.filters');
    const tPets = useTranslations('pets');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Same parsing as the server page, so invalid values are ignored here too.
    const active: PetFiltersValue =
        PetFiltersSchema.safeParse(Object.fromEntries(searchParams)).data ?? {};
    const species = active.species ?? ALL;
    const age = active.age ?? ALL;
    const sex = active.sex ?? null;
    const listingType = active.listing_type ?? null;
    const sortKey = getSortKey(
        searchParams.get('sortBy'),
        searchParams.get('ascending'),
    );

    // Text fields keep local state so typing stays responsive; the URL is
    // updated after a short pause. The ref mirrors the state so every
    // navigation (debounced or not) carries the latest typed values.
    const [text, setTextState] = useState<TextValues>(() =>
        readText(searchParams),
    );
    const textRef = useRef(text);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    function setText(next: TextValues) {
        textRef.current = next;
        setTextState(next);
    }

    function navigate(changes: Partial<Record<FilterKey, string | null>> = {}) {
        clearTimeout(debounceRef.current);
        const params = new URLSearchParams(searchParams.toString());
        const textChanges = Object.fromEntries(
            TEXT_KEYS.map((key) => [key, textRef.current[key].trim() || null]),
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
        const query = params.toString();
        startTransition(() => {
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        });
    }

    function changeText(key: TextKey, value: string) {
        setText({ ...textRef.current, [key]: value });
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => navigate(), TEXT_DEBOUNCE_MS);
    }

    function changeListingType(id: string | null) {
        // Price only applies to sale listings; drop it when leaving "sale".
        if (id !== 'sale') {
            setText({ ...textRef.current, min_price: '', max_price: '' });
        }
        navigate({ listing_type: id });
    }

    function changeSort(key: SortKey) {
        const { sortBy, ascending } = SORT_OPTIONS[key];
        navigate(
            key === 'newest'
                ? { sortBy: null, ascending: null }
                : { sortBy, ascending: ascending ? 'true' : null },
        );
    }

    function removeFilter(key: FilterKey) {
        if ((TEXT_KEYS as readonly string[]).includes(key)) {
            setText({ ...textRef.current, [key]: '' });
        }
        if (key === 'listing_type') changeListingType(null);
        else navigate({ [key]: null });
    }

    function reset() {
        setText(readText(new URLSearchParams()));
        clearTimeout(debounceRef.current);
        const sort = new URLSearchParams();
        for (const key of ['sortBy', 'ascending']) {
            const value = searchParams.get(key);
            if (value) sort.set(key, value);
        }
        const query = sort.toString();
        startTransition(() => {
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        });
    }

    // Chips mirror the URL (not the text being typed), so they show what the
    // results are actually filtered by.
    const chips: { key: FilterKey; label: string }[] = [];
    if (active.listing_type) {
        chips.push({
            key: 'listing_type',
            label: tPets(`listingType.${active.listing_type}`),
        });
    }
    if (active.species) {
        chips.push({
            key: 'species',
            label: tPets(`species.${active.species}`),
        });
    }
    if (active.sex) {
        chips.push({ key: 'sex', label: tPets(`sex.${active.sex}`) });
    }
    if (active.age) {
        chips.push({ key: 'age', label: t(`ageGroups.${active.age}`) });
    }
    for (const key of TEXT_KEYS) {
        const value = active[key];
        if (value !== undefined && value !== '') {
            chips.push({ key, label: t(`chips.${key}`, { value }) });
        }
    }
    for (const key of FLAG_KEYS) {
        if (active[key]) chips.push({ key, label: t(FLAG_LABEL_KEYS[key]) });
    }

    // Rendered in the desktop sidebar and in the mobile drawer. A plain
    // function (not a component) so inputs keep focus across re-renders.
    function renderPanel() {
        return (
            <div className="grid gap-6">
                <FilterGroup label={t('listingType')}>
                    <div className="flex flex-wrap gap-2">
                        {[null, ...LISTING_TYPES.map(({ id }) => id)].map(
                            (id) => (
                                <button
                                    key={id ?? ALL}
                                    type="button"
                                    aria-pressed={listingType === id}
                                    className={pillClass(listingType === id)}
                                    onClick={() => changeListingType(id)}
                                >
                                    {id
                                        ? tPets(`listingType.${id}`)
                                        : t('allListings')}
                                </button>
                            ),
                        )}
                    </div>
                </FilterGroup>

                <Select
                    value={species}
                    onChange={(key) =>
                        navigate({
                            species: key && key !== ALL ? String(key) : null,
                        })
                    }
                    variant="secondary"
                >
                    <Label>{t('species')}</Label>
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id={ALL} textValue={t('allSpecies')}>
                                {t('allSpecies')}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                            {SPECIES.map(({ id }) => (
                                <ListBox.Item
                                    key={id}
                                    id={id}
                                    textValue={tPets(`species.${id}`)}
                                >
                                    {tPets(`species.${id}`)}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <FilterGroup label={t('sex')}>
                    <div className="flex flex-wrap gap-2">
                        {[null, ...SEX_FILTER_OPTIONS.map(({ id }) => id)].map(
                            (id) => (
                                <button
                                    key={id ?? ALL}
                                    type="button"
                                    aria-pressed={sex === id}
                                    className={pillClass(sex === id)}
                                    onClick={() => navigate({ sex: id })}
                                >
                                    {id ? tPets(`sex.${id}`) : t('anySex')}
                                </button>
                            ),
                        )}
                    </div>
                </FilterGroup>

                <Select
                    value={age}
                    onChange={(key) =>
                        navigate({
                            age: key && key !== ALL ? String(key) : null,
                        })
                    }
                    variant="secondary"
                >
                    <Label>{t('age')}</Label>
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id={ALL} textValue={t('anyAge')}>
                                {t('anyAge')}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                            {PET_AGE_GROUPS.map((id) => (
                                <ListBox.Item
                                    key={id}
                                    id={id}
                                    textValue={t(`ageGroups.${id}`)}
                                >
                                    {t(`ageGroups.${id}`)}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <TextField
                    value={text.breed}
                    onChange={(value) => changeText('breed', value)}
                    variant="secondary"
                >
                    <Label>{t('breed')}</Label>
                    <Input placeholder={t('breedPlaceholder')} />
                </TextField>

                <TextField
                    value={text.city}
                    onChange={(value) => changeText('city', value)}
                    variant="secondary"
                >
                    <Label>{t('city')}</Label>
                    <Input placeholder={t('cityPlaceholder')} />
                </TextField>

                {listingType === 'sale' && (
                    <div className="grid grid-cols-2 gap-3">
                        <TextField
                            value={text.min_price}
                            onChange={(value) => changeText('min_price', value)}
                            variant="secondary"
                        >
                            <Label>{t('priceFrom')}</Label>
                            <Input type="number" min={0} inputMode="numeric" />
                        </TextField>
                        <TextField
                            value={text.max_price}
                            onChange={(value) => changeText('max_price', value)}
                            variant="secondary"
                        >
                            <Label>{t('priceTo')}</Label>
                            <Input type="number" min={0} inputMode="numeric" />
                        </TextField>
                    </div>
                )}

                <FilterGroup label={t('more')}>
                    {FLAG_KEYS.map((key) => (
                        <Switch
                            key={key}
                            isSelected={!!active[key]}
                            onChange={(isSelected) =>
                                navigate({ [key]: isSelected ? 'true' : null })
                            }
                            className="justify-between"
                        >
                            <Switch.Content className="text-sm mr-auto">
                                {t(FLAG_LABEL_KEYS[key])}
                            </Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch>
                    ))}
                </FilterGroup>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
            <aside
                aria-label={t('title')}
                className="hidden lg:block sticky top-6 bg-surface rounded-card shadow-my ring-1 ring-border p-5"
            >
                <div className="flex items-baseline justify-between mb-4">
                    <h2 className="font-display font-extrabold text-xl">
                        {t('title')}
                    </h2>
                    {chips.length > 0 && (
                        <button
                            type="button"
                            onClick={reset}
                            className="text-sm font-heading font-bold text-accent hover:underline cursor-pointer"
                        >
                            {t('clearAll')}
                        </button>
                    )}
                </div>
                {renderPanel()}
            </aside>

            <div className="min-w-0">
                <div className="flex flex-wrap items-end gap-3 mb-4">
                    <Drawer>
                        <Button variant="secondary" className="lg:hidden">
                            <LuSlidersHorizontal aria-hidden />
                            {t('openFilters')}
                            {chips.length > 0 && (
                                <span className="ml-1 rounded-full bg-accent text-accent-foreground text-xs px-2 py-0.5">
                                    {chips.length}
                                </span>
                            )}
                        </Button>
                        <Drawer.Backdrop>
                            <Drawer.Content placement="left">
                                <Drawer.Dialog>
                                    <Drawer.CloseTrigger />
                                    <Drawer.Header>
                                        <Drawer.Heading className="font-display font-extrabold text-xl">
                                            {t('title')}
                                        </Drawer.Heading>
                                    </Drawer.Header>
                                    <Drawer.Body>{renderPanel()}</Drawer.Body>
                                    <Drawer.Footer className="flex gap-2">
                                        {chips.length > 0 && (
                                            <Button
                                                variant="secondary"
                                                onPress={reset}
                                            >
                                                {t('clearAll')}
                                            </Button>
                                        )}
                                        <Button slot="close" className="flex-1">
                                            {t('showResults')}
                                        </Button>
                                    </Drawer.Footer>
                                </Drawer.Dialog>
                            </Drawer.Content>
                        </Drawer.Backdrop>
                    </Drawer>

                    <TextField
                        value={text.q}
                        onChange={(value) => changeText('q', value)}
                        variant="secondary"
                        aria-label={t('search')}
                        className="grow basis-60"
                    >
                        <div className="relative">
                            <LuSearch
                                aria-hidden
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                            />
                            <Input
                                type="search"
                                placeholder={t('searchPlaceholder')}
                                className="pl-9 w-full"
                            />
                        </div>
                    </TextField>

                    <Select
                        value={sortKey}
                        onChange={(key) => key && changeSort(key as SortKey)}
                        variant="secondary"
                        aria-label={t('sort')}
                        className="w-full sm:w-56"
                    >
                        <Select.Trigger>
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {(Object.keys(SORT_OPTIONS) as SortKey[]).map(
                                    (key) => (
                                        <ListBox.Item
                                            key={key}
                                            id={key}
                                            textValue={t(`sortOptions.${key}`)}
                                        >
                                            {t(`sortOptions.${key}`)}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ),
                                )}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {chips.length > 0 && (
                    <ul
                        aria-label={t('activeFilters')}
                        className="flex flex-wrap items-center gap-2 mb-4"
                    >
                        {chips.map(({ key, label }) => (
                            <li key={key}>
                                <button
                                    type="button"
                                    onClick={() => removeFilter(key)}
                                    aria-label={t('removeFilter', { label })}
                                    className="group inline-flex items-center gap-1.5 rounded-full bg-soft pl-3 pr-2 py-1 text-sm font-bold text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    {label}
                                    <LuX aria-hidden className="size-3.5" />
                                </button>
                            </li>
                        ))}
                        {chips.length > 1 && (
                            <li>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="text-sm font-heading font-bold text-accent hover:underline cursor-pointer px-1"
                                >
                                    {t('clearAll')}
                                </button>
                            </li>
                        )}
                    </ul>
                )}

                <div
                    aria-busy={isPending}
                    className={clsx(
                        'transition-opacity duration-300',
                        isPending && 'opacity-50 pointer-events-none',
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
