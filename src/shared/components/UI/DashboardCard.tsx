import { Card } from '@heroui/react';

interface DashboardCardProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export default function DashboardCard({
    title,
    description,
    icon,
    children,
    ...props
}: DashboardCardProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Card {...props}>
            <Card.Header>
                {title && (
                    <Card.Title className="flex items-center gap-2 text-lg">
                        {icon}
                        {title}
                    </Card.Title>
                )}
                {description && (
                    <Card.Description>{description}</Card.Description>
                )}
            </Card.Header>
            <Card.Content className="gap-3">{children}</Card.Content>
        </Card>
    );
}
