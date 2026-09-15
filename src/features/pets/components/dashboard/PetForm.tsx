'use client';

import {
    Button,
    FieldError,
    Input,
    Label,
    NumberField,
    Radio,
    RadioGroup,
    Switch,
    TextArea,
    TextField,
    Select,
    ListBox,
    toast,
} from '@heroui/react';
import { useState, useRef, useTransition } from 'react';
import { SEX_OPTIONS, SPECIES, LISTING_TYPES } from '../../constants';
import { useTranslations } from 'next-intl';
import {
    FileUploader,
    FileUploaderRef,
} from '@shared/components/UI/FileUploader';
import { createPet, updatePet } from '../../actions';
import {
    LuBadgeAlert,
    LuCamera,
    LuCross,
    LuInfo,
    LuMapPin,
    LuTag,
} from 'react-icons/lu';
import DashboardCard from '@shared/components/UI/DashboardCard';
import { TbScissors, TbVaccine } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import type { PetWithShelter } from '@/types/pets';
import type { Shelter } from '@/types/shelters';
import clsx from 'clsx';

const radioClasses = {
    base: 'rounded-xl border border-accent px-4 py-1.5 transition-all',
    hovered:
        'group-data-[hovered=true]:bg-accent/10 group-data-[hovered=true]:border-accent',
    focus: 'group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-accent group-data-[focus-visible=true]:ring-offset-2',
    selected:
        'group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent group-data-[selected=true]:text-white',
};

export default function PetForm({
    initialData,
    shelters,
}: {
    initialData?: PetWithShelter;
    shelters?: Shelter[] | null;
}) {
    const isEditing = !!initialData;

    const t = useTranslations('dashboard.myPets');
    const tPets = useTranslations('pets');

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const fileUploaderRef = useRef<FileUploaderRef>(null);
    const [listingType, setListingType] = useState(
        initialData?.listing_type || false,
    );
    const [selectedShelterId, setSelectedShelterId] = useState(
        initialData?.shelter_id ?? null,
    );

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const imageUrls = (await fileUploaderRef.current?.upload()) ?? [];
            formData.delete('image_url');
            imageUrls.forEach((url) => formData.append('image_url', url));
            const response = isEditing
                ? await updatePet(initialData.id, formData)
                : await createPet(formData);

            if (response.success) {
                toast.success(
                    isEditing
                        ? t('notifications.updateSuccess')
                        : t('notifications.createSuccess'),
                );
                router.push('/dashboard/pets');
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
                        icon={<LuInfo className="text-accent text-xl" />}
                    >
                        <RadioGroup
                            name="species"
                            isRequired
                            defaultValue={initialData?.species ?? undefined}
                        >
                            <Label>{t('fields.species')}</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {SPECIES.map((option) => (
                                    <Radio
                                        key={option.id}
                                        value={option.id}
                                        className="m-0 group"
                                    >
                                        <Radio.Content
                                            className={clsx(
                                                radioClasses.base,
                                                radioClasses.hovered,
                                                radioClasses.focus,
                                                radioClasses.selected,
                                            )}
                                        >
                                            <span className="text-sm font-heading font-bold">
                                                {tPets(`species.${option.id}`)}
                                            </span>
                                        </Radio.Content>
                                    </Radio>
                                ))}
                            </div>
                            <FieldError />
                        </RadioGroup>

                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                variant="secondary"
                                name="name"
                                defaultValue={initialData?.name ?? undefined}
                            >
                                <Label>{t('fields.petName')}</Label>
                                <Input placeholder={t('fields.petName')} />
                                <FieldError />
                            </TextField>
                            <TextField
                                variant="secondary"
                                name="breed"
                                defaultValue={initialData?.breed ?? undefined}
                            >
                                <Label>{t('fields.breed')}</Label>
                                <Input placeholder={t('fields.breed')} />
                                <FieldError />
                            </TextField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <RadioGroup
                                name="sex"
                                isRequired
                                defaultValue={initialData?.sex ?? undefined}
                            >
                                <Label>{t('fields.sex')}</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {SEX_OPTIONS.map((option) => (
                                        <Radio
                                            key={option.id}
                                            value={option.id}
                                            className="m-0 group"
                                        >
                                            <Radio.Content
                                                className={clsx(
                                                    radioClasses.base,
                                                    radioClasses.hovered,
                                                    radioClasses.focus,
                                                    radioClasses.selected,
                                                )}
                                            >
                                                <span className="text-sm font-heading font-bold">
                                                    {tPets(`sex.${option.id}`)}
                                                </span>
                                            </Radio.Content>
                                        </Radio>
                                    ))}
                                </div>
                                <FieldError />
                            </RadioGroup>
                            <NumberField
                                variant="secondary"
                                name="age_months"
                                isRequired
                                minValue={0}
                                defaultValue={
                                    initialData?.age_months ?? undefined
                                }
                            >
                                <Label>{t('fields.age')}</Label>
                                <NumberField.Group>
                                    <NumberField.DecrementButton>
                                        −
                                    </NumberField.DecrementButton>
                                    <NumberField.Input />
                                    <NumberField.IncrementButton>
                                        +
                                    </NumberField.IncrementButton>
                                </NumberField.Group>
                                <FieldError />
                            </NumberField>
                        </div>
                        <TextField
                            variant="secondary"
                            name="description"
                            defaultValue={initialData?.description ?? undefined}
                        >
                            <Label>{t('fields.description')}</Label>
                            <TextArea placeholder={t('fields.description')} />
                            <FieldError />
                        </TextField>
                    </DashboardCard>
                    <DashboardCard
                        title={t('cardTitles.listing')}
                        icon={<LuTag className="text-accent text-xl" />}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* Listing type */}
                            <RadioGroup
                                name="listing_type"
                                isRequired
                                defaultValue={
                                    initialData?.listing_type ?? undefined
                                }
                                onChange={(nextValue) =>
                                    setListingType(nextValue === 'sale')
                                }
                            >
                                <Label>{t('fields.listingType')}</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {LISTING_TYPES.map((option) => (
                                        <Radio
                                            key={option.id}
                                            value={option.id}
                                            className="m-0 group"
                                        >
                                            <Radio.Content
                                                className={clsx(
                                                    radioClasses.base,
                                                    radioClasses.hovered,
                                                    radioClasses.focus,
                                                    radioClasses.selected,
                                                )}
                                            >
                                                <span className="text-sm font-heading font-bold">
                                                    {tPets(
                                                        `listingType.${option.id}`,
                                                    )}
                                                </span>
                                            </Radio.Content>
                                        </Radio>
                                    ))}
                                </div>
                                <FieldError />
                            </RadioGroup>
                            {listingType && (
                                <NumberField
                                    name="price"
                                    minValue={0}
                                    variant="secondary"
                                    defaultValue={
                                        initialData?.price ?? undefined
                                    }
                                >
                                    <Label>{t('fields.price')}</Label>
                                    <NumberField.Group>
                                        <NumberField.Input className="col-span-3" />
                                    </NumberField.Group>
                                    <FieldError />
                                </NumberField>
                            )}
                        </div>
                    </DashboardCard>
                    <DashboardCard
                        title={t('cardTitles.checkList')}
                        icon={<LuCross className="text-accent text-xl" />}
                    >
                        <div className="flex  gap-4">
                            <Switch
                                className="border border-border rounded-xl px-4 py-4 flex-1"
                                name="is_vaccinated"
                                defaultSelected={
                                    initialData?.is_vaccinated ?? false
                                }
                            >
                                <TbVaccine className="text-2xl text-green-500" />
                                <Switch.Content className="font-medium mr-auto">
                                    {t('fields.vaccinated')}
                                </Switch.Content>
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                            </Switch>
                            <Switch
                                className="border border-border rounded-xl px-4 py-4 flex-1"
                                name="is_sterilized"
                                defaultSelected={
                                    initialData?.is_sterilized ?? false
                                }
                            >
                                <TbScissors className="text-2xl text-blue-500" />
                                <Switch.Content className="font-medium mr-auto">
                                    {t('fields.sterilized')}
                                </Switch.Content>
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                            </Switch>
                            <Switch
                                className="border border-border rounded-xl px-4 py-4 flex-1"
                                name="is_special_needs"
                                defaultSelected={
                                    initialData?.is_special_needs ?? false
                                }
                            >
                                <LuBadgeAlert className="text-2xl text-red-500" />
                                <Switch.Content className="font-medium mr-auto">
                                    {t('fields.specialNeeds')}
                                </Switch.Content>
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                            </Switch>
                        </div>
                    </DashboardCard>
                </div>
                <div className="col-span-4 grid gap-6">
                    <DashboardCard
                        title={t('cardTitles.photo')}
                        icon={<LuCamera className="text-accent text-xl" />}
                    >
                        <FileUploader
                            ref={fileUploaderRef}
                            currentFiles={initialData?.image_url ?? undefined}
                            label={t('fields.photo')}
                            folder="pets"
                            multiple
                            maxFiles={5}
                            maxSizeMB={5}
                        />
                    </DashboardCard>
                    <DashboardCard
                        title={t('cardTitles.location')}
                        icon={<LuMapPin className="text-accent text-xl" />}
                    >
                        {shelters && (
                            <Select
                                name="shelter_id"
                                placeholder="Select one"
                                variant="secondary"
                                defaultValue={
                                    initialData?.shelter_id ?? undefined
                                }
                                onChange={(id) =>
                                    setSelectedShelterId(id ? String(id) : null)
                                }
                            >
                                <Label>{t('fields.shelter')}</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {shelters.map((shelter) => (
                                            <ListBox.Item
                                                key={shelter.id}
                                                id={shelter.id}
                                                textValue={shelter.name}
                                            >
                                                {shelter.name}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        )}
                        {!selectedShelterId && (
                            <>
                                <TextField
                                    name="city"
                                    variant="secondary"
                                    defaultValue={
                                        initialData?.city ?? undefined
                                    }
                                >
                                    <Label>{t('fields.city')}</Label>
                                    <Input placeholder={t('fields.city')} />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    name="address"
                                    variant="secondary"
                                    defaultValue={
                                        initialData?.address ?? undefined
                                    }
                                >
                                    <Label>{t('fields.address')}</Label>
                                    <Input placeholder={t('fields.address')} />
                                    <FieldError />
                                </TextField>
                            </>
                        )}
                    </DashboardCard>
                </div>
            </div>
            <div className="absolute right-0 -top-16 flex gap-4">
                <Button
                    variant="tertiary"
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
