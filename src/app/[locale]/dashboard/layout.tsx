import type { Metadata } from 'next';
import Sidebar from '@shared/components/sidebar/Sidebar';

// Private pages are never indexed (docs/seo.md).
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Lavender backdrop (same as auth) so white cards and the sidebar stand out.
        <div className="flex-1 grid grid-cols-[260px_1fr] gap-6 p-6 bg-hero">
            <Sidebar />
            <main className="relative min-w-0">{children}</main>
        </div>
    );
}
