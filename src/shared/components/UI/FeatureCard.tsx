import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import clsx from 'clsx';

// Each tone overrides the theme accent inside the card, so the icon, tint,
// glow and any accent link inside (ArrowLink) pick it up without extra props.
const TONES = {
    accent: '',
    rose: '[--accent:var(--color-rose-600)]',
    amber: '[--accent:var(--color-amber-600)]',
    sky: '[--accent:var(--color-sky-600)]',
} as const;

export type FeatureCardTone = keyof typeof TONES;

interface FeatureCardProps {
    icon: IconType;
    title: string;
    text: string;
    // Optional link or button under the text.
    action?: ReactNode;
    tone?: FeatureCardTone;
}

// Icon, title and short text in a card; used for audience and feature lists.
export default function FeatureCard({
    icon: Icon,
    title,
    text,
    action,
    tone = 'accent',
}: FeatureCardProps) {
    return (
        <div
            className={clsx(
                'h-full rounded-card bg-accent/6 shadow-[0_12px_32px_-12px] shadow-accent/30 p-6 flex gap-4',
                TONES[tone],
            )}
        >
            <span
                aria-hidden
                className="size-12 shrink-0 rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/35 flex items-center justify-center text-2xl"
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
