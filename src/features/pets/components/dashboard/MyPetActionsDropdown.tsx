'use client';

import { Button, Dropdown, Label, toast } from '@heroui/react';
import { useState, useTransition, type ReactNode } from 'react';
import { BiPencil } from 'react-icons/bi';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { IoTrashBin } from 'react-icons/io5';
import {
    LuBookmark,
    LuBookmarkX,
    LuCircleCheck,
    LuEye,
    LuEyeOff,
    LuRotateCcw,
} from 'react-icons/lu';
import { changePetStatus, deletePet } from '@features/pets/actions';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Enums } from '@supabase/database.types';
import type { Pet } from '@/types/pets';
import ClosePetModal from './ClosePetModal';
import { ROUTES } from '@shared/constants/routes';

type PetStatus = Enums<'pet_status'>;
type StatusAction = {
    label: 'reserve' | 'unreserve' | 'hide' | 'publish' | 'reopen';
    to: Exclude<PetStatus, 'closed'>;
    icon: ReactNode;
};

const ICON_CLASS = 'size-4 shrink-0 text-muted';

const RESERVE: StatusAction = {
    label: 'reserve',
    to: 'reserved',
    icon: <LuBookmark className={ICON_CLASS} />,
};
const UNRESERVE: StatusAction = {
    label: 'unreserve',
    to: 'active',
    icon: <LuBookmarkX className={ICON_CLASS} />,
};
const HIDE: StatusAction = {
    label: 'hide',
    to: 'hidden',
    icon: <LuEyeOff className={ICON_CLASS} />,
};
const PUBLISH: StatusAction = {
    label: 'publish',
    to: 'active',
    icon: <LuEye className={ICON_CLASS} />,
};
const REOPEN: StatusAction = {
    label: 'reopen',
    to: 'active',
    icon: <LuRotateCcw className={ICON_CLASS} />,
};

// Transitions offered from each status. Closing has its own modal (needs a reason).
const STATUS_ACTIONS = {
    active: [RESERVE, HIDE],
    reserved: [UNRESERVE, HIDE],
    hidden: [PUBLISH],
    closed: [REOPEN],
} satisfies Record<PetStatus, StatusAction[]>;

export default function MyPetActionsDropdown({
    pet,
}: {
    pet: Pick<Pet, 'id' | 'status' | 'listing_type'>;
}) {
    const t = useTranslations('dashboard.myPets');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isCloseOpen, setIsCloseOpen] = useState(false);

    const setStatus = (
        status: PetStatus,
        closeReason?: Enums<'pet_close_reason'>,
    ) => {
        const formData = new FormData();
        formData.set('status', status);
        if (closeReason) formData.set('close_reason', closeReason);

        startTransition(async () => {
            const result = await changePetStatus(pet.id, formData);

            if (!result.success) {
                toast.danger(t('notifications.statusChangeError'));
                return;
            }
            toast.success(t('notifications.statusChangeSuccess'));
            setIsCloseOpen(false);
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deletePet(pet.id);

            if (!result.success) {
                toast.danger(t('notifications.deleteError'));
                return;
            }
            toast.success(t('notifications.deleteSuccess'));
        });
    };

    const handleEdit = () => {
        router.push(ROUTES.dashboard.editPet(pet.id));
    };

    return (
        <>
            <Dropdown>
                <Button isIconOnly aria-label="Menu" variant="ghost">
                    <FaEllipsisVertical className="outline-none" />
                </Button>
                <Dropdown.Popover>
                    <Dropdown.Menu>
                        <Dropdown.Section>
                            <Dropdown.Item
                                onClick={handleEdit}
                                id="edit-pet"
                                textValue={t('buttons.edit')}
                            >
                                <BiPencil className={ICON_CLASS} />
                                <Label>{t('buttons.edit')}</Label>
                            </Dropdown.Item>
                        </Dropdown.Section>
                        <Dropdown.Section>
                            {STATUS_ACTIONS[pet.status].map((action) => (
                                <Dropdown.Item
                                    key={action.label}
                                    id={action.label}
                                    textValue={t(`buttons.${action.label}`)}
                                    onClick={() => setStatus(action.to)}
                                >
                                    {action.icon}
                                    <Label>{t(`buttons.${action.label}`)}</Label>
                                </Dropdown.Item>
                            ))}
                            {pet.status !== 'closed' ? (
                                <Dropdown.Item
                                    id="close-pet"
                                    textValue={t('buttons.closeListing')}
                                    onClick={() => setIsCloseOpen(true)}
                                >
                                    <LuCircleCheck className={ICON_CLASS} />
                                    <Label>{t('buttons.closeListing')}</Label>
                                </Dropdown.Item>
                            ) : null}
                        </Dropdown.Section>
                        <Dropdown.Section>
                            <Dropdown.Item
                                onClick={handleDelete}
                                id="delete-pet"
                                textValue={t('buttons.delete')}
                                variant="danger"
                            >
                                <IoTrashBin className="size-4 shrink-0 text-danger" />
                                <Label>
                                    {isPending
                                        ? t('buttons.deleting')
                                        : t('buttons.delete')}
                                </Label>
                            </Dropdown.Item>
                        </Dropdown.Section>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
            {isCloseOpen && (
                <ClosePetModal
                    isOpen={isCloseOpen}
                    onOpenChange={setIsCloseOpen}
                    listingType={pet.listing_type}
                    isPending={isPending}
                    onConfirm={(reason) => setStatus('closed', reason)}
                />
            )}
        </>
    );
}
