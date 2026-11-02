import { notFound } from 'next/navigation';

// Unknown paths under a locale (/en/whatever) render [locale]/not-found.tsx
// inside the localized layout instead of the bare root 404.
export default function CatchAll() {
    notFound();
}
