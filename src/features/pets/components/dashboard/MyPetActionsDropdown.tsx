'use client';

import { Button, Dropdown, Label, toast } from '@heroui/react';
import { useTransition } from 'react';
import { BiPencil } from 'react-icons/bi';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { IoTrashBin } from 'react-icons/io5';
import { deletePet } from '@features/pets/actions';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function MyPetActionsDropdown({ petId }: { petId: string }) {
    const t = useTranslations('dashboard.myPets');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deletePet(petId);

            if (!result.success) {
                toast.danger(t('notifications.deleteError'));
                return;
            }
            toast.success(t('notifications.deleteSuccess'));
        });
    };

    const handleEdit = () => {
        router.push(`/dashboard/pets/edit/${petId}`);
    };

    return (
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
                            textValue="Edit pet"
                        >
                            <BiPencil className="size-4 shrink-0 text-muted" />
                            <Label>{t('buttons.edit')}</Label>
                        </Dropdown.Item>
                    </Dropdown.Section>
                    <Dropdown.Section>
                        <Dropdown.Item
                            onClick={handleDelete}
                            id="delete-pet"
                            textValue="Delete pet"
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
    );
}
