import { LINK_EXPIRED_ERROR } from '@features/auth/constants';
import ForgotPasswordForm from './ForgotPasswordForm';

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string | string[] }>;
}) {
    const { error } = await searchParams;

    return <ForgotPasswordForm isLinkExpired={error === LINK_EXPIRED_ERROR} />;
}
