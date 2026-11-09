// Title block of every dashboard page, so lists, forms, and settings look the same.
export default function DashboardPageHeader({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-6">
            <h1 className="font-display font-extrabold text-3xl">{title}</h1>
            {description && <p className="text-muted mt-2">{description}</p>}
        </div>
    );
}
