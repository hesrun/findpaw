import type { ReactNode } from 'react';

export default function ContactLink({
    href,
    icon,
    children,
    external,
}: {
    href: string;
    icon: ReactNode;
    children: ReactNode;
    external?: boolean;
}) {
    return (
        <li>
            <a
                href={href}
                {...(external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                })}
                className="group flex items-center gap-2 text-sm min-w-0"
            >
                <span
                    className="w-8 h-8 shrink-0 rounded-full bg-soft text-accent flex items-center justify-center text-base transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
                    aria-hidden
                >
                    {icon}
                </span>
                <span className="truncate transition-colors duration-300 group-hover:text-accent">
                    {children}
                </span>
            </a>
        </li>
    );
}
