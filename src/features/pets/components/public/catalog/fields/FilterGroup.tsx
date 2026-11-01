import type { ReactNode } from 'react';

export default function FilterGroup({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <fieldset className="grid gap-2">
            <legend className="text-sm font-heading font-bold mb-2">
                {label}
            </legend>
            {children}
        </fieldset>
    );
}
