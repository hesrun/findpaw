'use client';

import { Button, Dropdown, Label, toast } from '@heroui/react';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { deleteShelter } from '../../actions';
import { LuEllipsis } from 'react-icons/lu';
import { BiPencil } from 'react-icons/bi';
import { IoTrashBin } from 'react-icons/io5';

export default function MyShelterActionsDropdown({
    shelterId,
}: {
    shelterId: string;
}) {
    const t = useTranslations('dashboard.myShelters');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteShelter(shelterId);
            if (result.success) {
                toast.success(t('notifications.deleteSuccess'));
            } else {
                toast.danger(t('notifications.deleteError'));
            }
        });
    }

    return (
        <Dropdown>
            <Button isIconOnly aria-label="Menu" variant="ghost">
                <LuEllipsis />
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Section>
                        <Dropdown.Item
                            onClick={() =>
                                router.push(
                                    `/dashboard/shelters/edit/${shelterId}`,
                                )
                            }
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
                            <Label>{t('buttons.delete')}</Label>
                        </Dropdown.Item>
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
