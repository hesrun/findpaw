import { redirect } from '@/i18n/navigation';
import { DASHBOARD_HOME } from '@shared/constants/routes';

// The dashboard has no overview page yet; its home is the user's pets.
export default async function DashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    redirect({ href: DASHBOARD_HOME, locale });
}
