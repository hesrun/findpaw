import { Card } from '@heroui/react';
import clsx from 'clsx';

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
    className,
    ...props
}: DashboardCardProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Card
            {...props}
            className={clsx('rounded-card shadow-my ring-1 ring-border', className)}
        >
            <Card.Header>
                {title && (
                    <Card.Title className="flex items-center gap-2 font-display font-extrabold text-lg">
                        {icon && <span className="text-accent text-xl">{icon}</span>}
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
