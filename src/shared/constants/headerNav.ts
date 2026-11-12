import { ROUTES } from '@shared/constants/routes';
// Public site sections in the header (desktop nav and mobile menu).
// `key` is a key in the `header` translation namespace.
export const HEADER_NAV = [
    { key: 'pets', href: ROUTES.pets },
    { key: 'shelters', href: ROUTES.shelters },
    { key: 'about', href: ROUTES.about },
] as const;
