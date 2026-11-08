import type { Metadata } from 'next';
import LegalPage from '@features/legal/LegalPage';
import { getLegalMetadata } from '@features/legal/content';

export function generateMetadata(): Promise<Metadata> {
    return getLegalMetadata('terms');
}

export default function Terms() {
    return <LegalPage type="terms" />;
}
