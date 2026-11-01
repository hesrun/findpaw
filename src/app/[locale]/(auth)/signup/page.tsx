'use client';
import {
    Button,
    Card,
    FieldError,
    Input,
    Label,
    Radio,
    RadioGroup,
    TextField,
    toast,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition, type ReactNode } from 'react';
import { signUp } from '@/features/auth/actions/actions';
import type { SignUpRole } from '@features/auth/schemas';
import { FaRegUserCircle } from 'react-icons/fa';
import { TbHomeShield } from 'react-icons/tb';
import { BiClinic } from 'react-icons/bi';
import clsx from 'clsx';

// Keyed by the database role enum: adding or renaming a sign-up role
// fails type checking until it has an icon here.
const roleIcons = {
    user: <FaRegUserCircle />,
    shelter: <TbHomeShield />,
    clinic: <BiClinic />,
} satisfies Record<SignUpRole, ReactNode>;

const profileRoles = (Object.keys(roleIcons) as SignUpRole[]).map((value) => ({
    value,
    icon: roleIcons[value],
}));

export default function SignUp() {
    const roles = useTranslations('roles');
    const t = useTranslations('auth');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            const result = await signUp(formData);

            if (result?.error) {
                toast.danger(t(`errors.${result.error}`));
            } else {
                toast.success(t('notifications.signUpSuccess'));
                router.push('/signin');
            }
        });
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-8 w-full max-w-md m-auto p-6 mt-[8%]"
        >
            <Card className="p-6 grid gap-6">
                <h1 className="text-3xl font-display font-extrabold">
                    {t('titles.signup')}
                </h1>
                <div className="grid gap-4">
                    <RadioGroup
                        defaultValue="user"
                        name="role"
                        variant="secondary"
                    >
                        <Label>{t('fields.role')}</Label>
                        <div className="grid grid-cols-3 gap-4">
                            {profileRoles.map((option) => (
                                <Radio
                                    key={option.value}
                                    value={option.value}
                                    className={clsx(
                                        'group relative flex-col gap-4 rounded-xl border bg-surface px-4 py-4 mt-1 border-border transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10',
                                        'data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10',
                                    )}
                                >
                                    <Radio.Control className="absolute top-3.5 right-4 size-5">
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content className="flex flex-col gap-4">
                                        <span className="text-2xl text-accent">
                                            {option.icon && option.icon}
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <Label>{roles(option.value)}</Label>
                                        </div>
                                    </Radio.Content>
                                </Radio>
                            ))}
                        </div>
                    </RadioGroup>
                    <TextField
                        isRequired
                        name="userName"
                        type="text"
                        variant="secondary"
                        validate={(value) => {
                            if (value.length < 3) {
                                return t('errors.userNameInvalid');
                            }
                            return null;
                        }}
                    >
                        <Label>{t('fields.userName')}</Label>
                        <Input placeholder={t('fields.userName')} />
                        <FieldError />
                    </TextField>
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        variant="secondary"
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
                        variant="secondary"
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
                            <>{isPending ? 'Loading...' : t('btns.signup')}</>
                        )}
                    </Button>
                </div>
            </Card>
        </form>
    );
}
