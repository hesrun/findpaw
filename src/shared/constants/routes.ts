// Every app path in one place. Paths are locale-less: next-intl navigation
// (Link, redirect, router) and pageMetadata() add the locale prefix.
// Never write a path as a string literal elsewhere; add it here.
export const ROUTES = {
    home: '/',
    pets: '/pets',
    pet: (id: string) => `/pets/${id}`,
    shelters: '/shelters',
    shelter: (id: string) => `/shelters/${id}`,
    about: '/about',
    legal: {
        privacy: '/privacy',
        terms: '/terms',
        cookies: '/privacy#cookies',
    },
    auth: {
        signIn: '/signin',
        signUp: '/signup',
        forgotPassword: '/forgot-password',
        resetPassword: '/reset-password',
    },
    dashboard: {
        root: '/dashboard',
        pets: '/dashboard/pets',
        addPet: '/dashboard/pets/add',
        editPet: (id: string) => `/dashboard/pets/edit/${id}`,
        shelters: '/dashboard/shelters',
        addShelter: '/dashboard/shelters/add',
        editShelter: (id: string) => `/dashboard/shelters/edit/${id}`,
        settings: '/dashboard/settings',
    },
} as const;

// Where a signed-in user lands: after sign-in, from auth pages, and from
// /dashboard itself (the dashboard has no overview page yet).
export const DASHBOARD_HOME = ROUTES.dashboard.pets;
