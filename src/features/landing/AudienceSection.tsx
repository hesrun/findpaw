import { getTranslations } from 'next-intl/server';
import ArrowLink from '@UI/ArrowLink';
import FeatureCard from '@UI/FeatureCard';
import { LANDING_AUDIENCE } from './constants';

export default async function AudienceSection() {
    const t = await getTranslations('HomePage.audience');

    return (
        <section className="mt-14">
            <div className="container">
                <h2 className="font-display font-extrabold text-3xl mb-2">
                    {t('title')}
                </h2>
                <p className="text-muted mb-6 max-w-[60ch]">{t('lead')}</p>
                <ul className="grid gap-4 md:grid-cols-2">
                    {LANDING_AUDIENCE.map(({ key, icon, tone, href }) => (
                        <li key={key}>
                            <FeatureCard
                                icon={icon}
                                tone={tone}
                                title={t(`items.${key}.title`)}
                                text={t(`items.${key}.text`)}
                                action={
                                    <ArrowLink href={href}>
                                        {t(`items.${key}.action`)}
                                    </ArrowLink>
                                }
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
