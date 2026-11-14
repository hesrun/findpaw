import type { ReactNode } from 'react';

type EmptyStateProps = {
    title: string;
    hint?: string;
    action?: ReactNode;
};

// Shared stand-in for an empty list: an empty food bowl with a title, an
// optional hint, and an optional action. The bowl is drawn in the accent
// color with white and black overlays, so it works in both themes.
export function EmptyState({ title, hint, action }: EmptyStateProps) {
    return (
        <div className="surface-card p-10 grid justify-items-center gap-3 text-center">
            <svg
                viewBox="0 0 200 140"
                aria-hidden="true"
                className="w-40 h-auto mb-2"
            >
                <ellipse
                    cx="100"
                    cy="123"
                    rx="80"
                    ry="9"
                    className="fill-accent/10"
                />
                <path
                    d="M28 70 H172 L156 112 Q153 121 143 121 H57 Q47 121 44 112 Z"
                    className="fill-accent"
                />
                <ellipse
                    cx="100"
                    cy="106"
                    rx="8"
                    ry="6"
                    className="fill-white/70"
                />
                <circle cx="90" cy="97" r="3" className="fill-white/70" />
                <circle cx="96.5" cy="93" r="3" className="fill-white/70" />
                <circle cx="103.5" cy="93" r="3" className="fill-white/70" />
                <circle cx="110" cy="97" r="3" className="fill-white/70" />
                <ellipse
                    cx="100"
                    cy="70"
                    rx="74"
                    ry="14"
                    className="fill-accent"
                />
                <ellipse
                    cx="100"
                    cy="70"
                    rx="74"
                    ry="14"
                    className="fill-white/30"
                />
                <ellipse
                    cx="100"
                    cy="71"
                    rx="62"
                    ry="9"
                    className="fill-accent"
                />
                <ellipse
                    cx="100"
                    cy="71"
                    rx="62"
                    ry="9"
                    className="fill-black/30"
                />
                <ellipse
                    cx="86"
                    cy="73"
                    rx="3.2"
                    ry="1.6"
                    className="fill-[#cfae8a]"
                />
                <ellipse
                    cx="111"
                    cy="71.5"
                    rx="2.4"
                    ry="1.3"
                    className="fill-[#cfae8a]"
                />
                <ellipse
                    cx="172"
                    cy="122"
                    rx="3.4"
                    ry="2"
                    className="fill-[#cfae8a]"
                />
            </svg>
            <p className="font-display font-extrabold text-xl text-balance">
                {title}
            </p>
            {hint && <p className="text-muted max-w-[46ch]">{hint}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
