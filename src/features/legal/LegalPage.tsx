import { formatDate } from '@shared/helpers/dateFormat';
import { LEGAL_EFFECTIVE_DATE } from '@shared/constants/legal';
import { getLegalContent, type LegalDocumentType } from './content';
import LegalBlock from './LegalBlock';

export default async function LegalPage({ type }: { type: LegalDocumentType }) {
    const { locale, content } = await getLegalContent();
    const doc = content[type];
    const effectiveFrom = content.effectiveFrom.replace(
        '{date}',
        formatDate(LEGAL_EFFECTIVE_DATE, { locale }),
    );

    return (
        <main className="container pt-6 pb-16 grid gap-10">
            <header className="bg-hero rounded-[36px] p-6 sm:p-10 grid gap-4">
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] tracking-tight text-balance">
                    {doc.title}
                </h1>
                <p className="text-sm font-bold text-muted">{effectiveFrom}</p>
                {doc.intro.map((text) => (
                    <p key={text} className="text-muted leading-relaxed">
                        {text}
                    </p>
                ))}
            </header>

            <div className="grid gap-10 items-start lg:grid-cols-[1fr_300px]">
                {/* First in the DOM so the contents lead on mobile; on wide
                    screens they become a sticky sidebar on the right. */}
                <nav
                    aria-labelledby="legal-contents"
                    className="bg-surface rounded-card shadow-my ring-1 ring-border p-6 lg:order-last lg:sticky lg:top-6"
                >
                    <h2
                        id="legal-contents"
                        className="font-display font-extrabold text-xl mb-3"
                    >
                        {content.contents}
                    </h2>
                    <ol className="grid gap-1.5 list-decimal pl-5 marker:text-muted">
                        {doc.sections.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    className="font-bold text-accent hover:underline"
                                >
                                    {section.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <article className="grid gap-10">
                    {doc.sections.map((section, index) => (
                        <section
                            key={section.id}
                            id={section.id}
                            className="grid gap-4 scroll-mt-6"
                        >
                            <h2 className="font-display font-extrabold text-2xl">
                                {index + 1}. {section.title}
                            </h2>
                            {section.content.map((block, blockIndex) => (
                                <LegalBlock key={blockIndex} block={block} />
                            ))}
                        </section>
                    ))}
                </article>
            </div>
        </main>
    );
}
