import { getLocale, getTranslations } from 'next-intl/server';
import { LuFlag } from 'react-icons/lu';
import { LEGAL_OPERATOR } from '@shared/constants/legal';
import { SITE_URL } from '@shared/constants/seo';
import { localizedPath, toLocale } from '@shared/lib/seo';
import { mailtoHref } from '@shared/lib/url';

// DSA notice-and-action: opens an email to the operator with the page link
// and the points a report should contain (terms, "Reporting illegal content").
export default async function ReportLink({ path }: { path: string }) {
    const [t, locale] = await Promise.all([
        getTranslations('report'),
        getLocale(),
    ]);
    const url = `${SITE_URL}${localizedPath(toLocale(locale), path)}`;
    const href = mailtoHref(LEGAL_OPERATOR.email, {
        subject: t('subject', { url }),
        body: t('body', { url }),
    });

    return (
        <a
            href={href}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors"
        >
            <LuFlag aria-hidden />
            {t('link')}
        </a>
    );
}
