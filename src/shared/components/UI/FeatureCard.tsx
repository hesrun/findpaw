import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';

interface FeatureCardProps {
    icon: IconType;
    title: string;
    text: string;
    // Optional link or button under the text.
    action?: ReactNode;
}

// Icon, title and short text in a card; used for audience and feature lists.
export default function FeatureCard({
    icon: Icon,
    title,
    text,
    action,
}: FeatureCardProps) {
    return (
        <div className="h-full bg-surface rounded-card shadow-my ring-1 ring-border p-6 flex gap-4">
            <span
                aria-hidden
                className="size-12 shrink-0 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center text-2xl"
            >
                <Icon />
            </span>
            <div className="flex flex-col gap-1">
                <h3 className="font-display font-extrabold text-xl">{title}</h3>
                <p className="text-muted leading-relaxed">{text}</p>
                {action && <div className="mt-auto pt-2">{action}</div>}
            </div>
        </div>
    );
}
