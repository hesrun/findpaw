export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Lavender backdrop so the white form card stands out.
    return (
        <main className="flex-1 bg-hero">
            <div className="container mx-auto p-4">{children}</div>
        </main>
    );
}
