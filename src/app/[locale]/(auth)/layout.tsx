export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="flex-1 container mx-auto p-4">{children}</main>;
}
