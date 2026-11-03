import type { Metadata } from 'next';
import LegalPage from '@features/legal/LegalPage';
import { getLegalContent } from '@features/legal/content';

export async function generateMetadata(): Promise<Metadata> {
    const { content } = await getLegalContent();
    return { title: content.terms.metaTitle };
}

export default function Terms() {
    return <LegalPage type="terms" />;
}
