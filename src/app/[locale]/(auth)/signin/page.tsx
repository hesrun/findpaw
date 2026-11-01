'use client';

import { signIn } from '@features/auth/actions/actions';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
    Button,
    Card,
    FieldError,
    Input,
    Label,
    TextField,
    toast,
} from '@heroui/react';

export default function SignIn() {
    const t = useTranslations('auth');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            const result = await signIn(formData);

            if (result?.error) {
                toast.danger(t(`errors.${result.error}`));
            } else {
                toast.success(t('notifications.signInSuccess'));
                router.push('/dashboard/pets');
            }
        });
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6 mt-[10%]"
        >
            <Card className="p-6 grid gap-6">
                <h1 className="text-3xl font-display font-extrabold">
                    {t('titles.sign')}
                </h1>
                <div className="grid gap-4">
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        validate={(value) => {
                            if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                    value,
                                )
                            ) {
                                return t('errors.emailInvalid');
                            }
                            return null;
                        }}
                    >
                        <Label>{t('fields.email')}</Label>
                        <Input placeholder={t('fields.email')} />
                        <FieldError />
                    </TextField>
                    <TextField
                        isRequired
                        minLength={8}
                        name="password"
                        type="password"
                        validate={(value) => {
                            if (value.length < 8) {
                                return t('errors.passwordInvalid');
                            }
                            return null;
                        }}
                    >
                        <Label>{t('fields.password')}</Label>
                        <Input placeholder={t('fields.password')} />
                        <FieldError />
                    </TextField>
                </div>
                <div className="flex gap-2">
                    <Button fullWidth type="submit" isPending={isPending}>
                        {({ isPending }) => (
                            <>{isPending ? 'Loading...' : t('btns.sign')}</>
                        )}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
