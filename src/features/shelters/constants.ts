// Shelters on one page of the public catalog (/shelters).
export const SHELTER_CATALOG_PAGE_SIZE = 12;

// Upper bound for `pageSize` in public shelter queries.
export const SHELTER_MAX_PAGE_SIZE = 48;

// Recently added shelters on the landing page.
export const FEATURED_SHELTERS_COUNT = 6;

// Pets on one page of the shelter detail page.
export const SHELTER_PETS_PAGE_SIZE = 6;

// Columns the public shelter list may be sorted by.
export const SHELTER_SORT_FIELDS = ['created_at', 'name'] as const;
