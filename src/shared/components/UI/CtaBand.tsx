import type { ReactNode } from 'react';

interface CtaBandProps {
    title: string;
    text: string;
    // Buttons or links.
    children: ReactNode;
}

// Closing call-to-action band at the bottom of a page.
export default function CtaBand({ title, text, children }: CtaBandProps) {
    return (
        <section className="bg-soft rounded-[36px] p-6 sm:p-10 text-center grid gap-4 justify-items-center">
            <h2 className="font-display font-extrabold text-3xl text-balance">
                {title}
            </h2>
            <p className="text-muted max-w-[52ch]">{text}</p>
            <div className="flex flex-wrap justify-center gap-3">
                {children}
            </div>
        </section>
    );
}
