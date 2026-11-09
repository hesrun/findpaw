'use client';

import {
    Button,
    Description,
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
} from '@heroui/react';
import { useState } from 'react';
import {
    SEX_OPTIONS,
    SPECIES,
    LISTING_TYPES,
    PRICED_LISTING_TYPE,
    REWARD_LISTING_TYPE,
    PET_MAX_PHOTOS,
} from '@features/pets/constants';
import { useTranslations } from 'next-intl';
import { FileUploader } from '@shared/components/UI/uploader/FileUploader';
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
import type { PetWithShelter } from '@/types/pets';
import type { Shelter } from '@/types/shelters';
import clsx from 'clsx';
import PetLocationFields from './location/PetLocationFields';
import BreedField from './BreedField';
import { usePetFormSubmit } from './hooks/usePetFormSubmit';

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
    const t = useTranslations('dashboard.myPets');
    const tPets = useTranslations('pets');

    const { handleSubmit, isPending, fileUploaderRef, goBack } =
        usePetFormSubmit(initialData?.id);
    const [species, setSpecies] = useState<string | null>(
        initialData?.species ?? null,
    );
    const [listingType, setListingType] = useState<string | null>(
        initialData?.listing_type ?? null,
    );
    const [selectedShelterId, setSelectedShelterId] = useState(
        initialData?.shelter_id ?? null,
    );

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="grid grid-cols-12 gap-6 items-start mb-8">
                <div className="col-span-8 grid gap-6">
                    <DashboardCard
                        title={t('cardTitles.general')}
                        icon={<LuInfo />}
                    >
                        <RadioGroup
                            name="species"
                            isRequired
                            value={species}
                            onChange={setSpecies}
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
                            <BreedField
                                key={species}
                                species={species}
                                saved={initialData}
                            />
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
                        icon={<LuTag />}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* Listing type */}
                            <RadioGroup
                                name="listing_type"
                                isRequired
                                defaultValue={
                                    initialData?.listing_type ?? undefined
                                }
                                onChange={setListingType}
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
                            {listingType === REWARD_LISTING_TYPE && (
                                <NumberField
                                    name="reward"
                                    minValue={1}
                                    variant="secondary"
                                    defaultValue={
                                        initialData?.reward ?? undefined
                                    }
                                >
                                    <Label>{t('fields.reward')}</Label>
                                    <NumberField.Group>
                                        <NumberField.Input className="col-span-3" />
                                    </NumberField.Group>
                                    <Description>
                                        {t('fields.rewardHint')}
                                    </Description>
                                    <FieldError />
                                </NumberField>
                            )}
                            {listingType === PRICED_LISTING_TYPE && (
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
                        icon={<LuCross />}
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
                        icon={<LuCamera />}
                    >
                        <FileUploader
                            ref={fileUploaderRef}
                            currentFiles={initialData?.image_url ?? undefined}
                            label={t('fields.photo')}
                            folder="pets"
                            maxFiles={PET_MAX_PHOTOS}
                        />
                    </DashboardCard>
                    <DashboardCard
                        title={t('cardTitles.location')}
                        icon={<LuMapPin />}
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
                            <PetLocationFields
                                initialData={initialData}
                                listingType={listingType}
                            />
                        )}
                    </DashboardCard>
                </div>
            </div>
            <div className="absolute right-0 -top-16 flex gap-4">
                <Button
                    variant="tertiary"
                    type="button"
                    onPress={goBack}
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
