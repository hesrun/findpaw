import type { Metadata } from 'next';

// Sign-in forms are not search results (docs/seo.md).
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Lavender backdrop so the white form card stands out; m-auto inside
    // the flex parent centers the form both ways.
    return (
        <main className="flex-1 flex bg-hero">
            <div className="container m-auto p-4">{children}</div>
        </main>
    );
}
