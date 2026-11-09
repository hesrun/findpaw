'use client';

import {
    Button,
    FieldError,
    Input,
    Label,
    TextArea,
    TextField,
    toast,
} from '@heroui/react';
import { useRef, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
    FileUploader,
    FileUploaderRef,
} from '@shared/components/UI/uploader/FileUploader';
import { uploadToFormData } from '@shared/components/UI/uploader/uploadToFormData';
import { SHELTER_MAX_PHOTOS } from '@features/shelters/constants';
import DashboardCard from '@shared/components/UI/DashboardCard';
import { createShelter, updateShelter } from '@features/shelters/actions';
import { LuBuilding2, LuCamera, LuContact, LuMapPin } from 'react-icons/lu';
import { isHttpUrl } from '@shared/lib/url';
import { Database } from '@supabase/database.types';

type Shelter = Database['public']['Tables']['shelters']['Row'];

// `defaultContact` prefills a new shelter with the owner's account contact.
export default function ShelterForm({
    initialData,
    defaultContact,
}: {
    initialData?: Shelter;
    defaultContact?: Pick<Shelter, 'phone' | 'email'>;
}) {
    const contact = initialData ?? defaultContact;
    const isEditing = !!initialData;
    const t = useTranslations('dashboard.myShelters');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const fileUploaderRef = useRef<FileUploaderRef>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            await uploadToFormData(
                fileUploaderRef.current,
                formData,
                'img_url',
            );

            const response = isEditing
                ? await updateShelter(initialData.id, formData)
                : await createShelter(formData);

            if (response.success) {
                toast.success(
                    isEditing
                        ? t('notifications.updateSuccess')
                        : t('notifications.createSuccess'),
                );
                router.push('/dashboard/shelters');
            } else {
                toast.danger(
                    isEditing
                        ? t('notifications.updateError')
                        : t('notifications.createError'),
                );
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="grid grid-cols-12 gap-6 items-start mb-8">
                <div className="col-span-8 grid gap-6">
                    <DashboardCard
                        title={t('cardTitles.general')}
                        icon={<LuBuilding2 />}
                    >
                        <TextField
                            isRequired
                            name="name"
                            defaultValue={initialData?.name ?? ''}
                            variant="secondary"
                        >
                            <Label>{t('fields.name')}</Label>
                            <Input placeholder={t('fields.name')} />
                            <FieldError />
                        </TextField>
                        <TextField
                            name="description"
                            defaultValue={initialData?.description ?? ''}
                            variant="secondary"
                        >
                            <Label>{t('fields.description')}</Label>
                            <TextArea
                                placeholder={t('fields.description')}
                                rows={4}
                            />
                            <FieldError />
                        </TextField>
                    </DashboardCard>
                    <DashboardCard
                        title={t('cardTitles.contacts')}
                        icon={<LuContact />}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                name="phone"
                                defaultValue={contact?.phone ?? ''}
                                variant="secondary"
                            >
                                <Label>{t('fields.phone')}</Label>
                                <Input placeholder={t('fields.phone')} />
                                <FieldError />
                            </TextField>
                            <TextField
                                name="email"
                                type="email"
                                variant="secondary"
                                defaultValue={contact?.email ?? ''}
                            >
                                <Label>{t('fields.email')}</Label>
                                <Input placeholder={t('fields.email')} />
                                <FieldError />
                            </TextField>
                        </div>
                        <TextField
                            name="website"
                            variant="secondary"
                            defaultValue={initialData?.website ?? ''}
                            validate={(value) =>
                                value && !isHttpUrl(value)
                                    ? t('errors.websiteInvalid')
                                    : null
                            }
                        >
                            <Label>{t('fields.website')}</Label>
                            <Input placeholder="https://" />
                            <FieldError />
                        </TextField>
                    </DashboardCard>
                </div>
                <div className="col-span-4 grid gap-6">
                    <DashboardCard
                        title={t('cardTitles.photos')}
                        icon={<LuCamera />}
                    >
                        <FileUploader
                            ref={fileUploaderRef}
                            maxFiles={SHELTER_MAX_PHOTOS}
                            folder="shelters"
                            currentFiles={initialData?.img_url}
                            label={t('fields.photos')}
                        />
                    </DashboardCard>
                    <DashboardCard
                        title={t('cardTitles.location')}
                        icon={<LuMapPin />}
                    >
                        <TextField
                            name="city"
                            defaultValue={initialData?.city ?? ''}
                            variant="secondary"
                        >
                            <Label>{t('fields.city')}</Label>
                            <Input placeholder={t('fields.city')} />
                            <FieldError />
                        </TextField>
                        <TextField
                            name="address"
                            variant="secondary"
                            defaultValue={initialData?.address ?? ''}
                        >
                            <Label>{t('fields.address')}</Label>
                            <Input placeholder={t('fields.address')} />
                            <FieldError />
                        </TextField>
                    </DashboardCard>
                </div>
            </div>
            <div className="absolute right-0 -top-16 flex gap-4">
                <Button
                    variant="outline"
                    type="button"
                    onPress={() => router.back()}
                >
                    {t('buttons.back')}
                </Button>
                <Button type="submit" isPending={isPending}>
                    {({ isPending }) => (
                        <>
                            {isPending
                                ? t('buttons.saving')
                                : t('buttons.save')}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
