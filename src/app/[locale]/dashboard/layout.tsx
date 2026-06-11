import Sidebar from '@shared/components/sidebar/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 grid grid-cols-[250px_1fr]">
            <Sidebar />
            <main className="p-4 relative">{children}</main>
        </div>
    );
}
