import { LEGAL_OPERATOR } from '@shared/constants/legal';

// Fills {name} and {email} placeholders with the operator details.
export function fillOperator(text: string) {
    return text.replace(
        /\{(name|email)\}/g,
        (_, key: keyof typeof LEGAL_OPERATOR) => LEGAL_OPERATOR[key],
    );
}

// One content block of a legal section: a paragraph or a bullet list.
export default function LegalBlock({ block }: { block: string | string[] }) {
    if (typeof block === 'string') {
        return <p className="leading-relaxed">{fillOperator(block)}</p>;
    }

    return (
        <ul className="grid gap-2 list-disc pl-5 leading-relaxed marker:text-accent">
            {block.map((item) => (
                <li key={item}>{fillOperator(item)}</li>
            ))}
        </ul>
    );
}
