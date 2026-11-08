import type { ComponentProps } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';

// Inline text link with a trailing arrow ("View all", "Report a pet").
export default function ArrowLink({
    children,
    ...props
}: ComponentProps<typeof Link>) {
    return (
        <Link
            {...props}
            className="inline-flex items-center gap-1 font-heading font-bold text-accent hover:underline"
        >
            {children}
            <LuArrowRight aria-hidden />
        </Link>
    );
}
