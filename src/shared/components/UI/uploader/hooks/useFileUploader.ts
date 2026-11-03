'use client';

import { useImperativeHandle, useState, type Ref } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from '@heroui/react';
import { isFileDropItem, type DropZoneProps } from 'react-aria-components';
import {
    IMAGE_ACCEPTED_TYPES,
    IMAGE_MAX_SIZE_MB,
    type ImageUploadFolder,
} from '@shared/constants/images';
import { signImageUpload } from '@shared/lib/cloudinary/actions';
import { uploadImage } from '@shared/lib/cloudinary/upload';

export type FileUploaderRef = {
    // Uploads the files picked since the last call and returns every URL
    // the form should save. Throws (after a toast) when an upload fails.
    upload: () => Promise<string[]>;
};

type PendingFile = { id: string; file: File; previewUrl: string };

// Picked files stay in the browser until the form is saved, so an
// abandoned form leaves nothing in Cloudinary.
export function useFileUploader({
    ref,
    folder,
    maxFiles,
    currentFiles,
}: {
    ref: Ref<FileUploaderRef> | undefined;
    folder: ImageUploadFolder;
    maxFiles: number;
    currentFiles?: string[] | null;
}) {
    const t = useTranslations('uploader');
    const [existing, setExisting] = useState<string[]>(currentFiles ?? []);
    const [pending, setPending] = useState<PendingFile[]>([]);
    const canAddMore = existing.length + pending.length < maxFiles;

    async function upload() {
        if (!pending.length) return existing;

        let uploaded: string[];
        try {
            const signed = await signImageUpload(folder);
            uploaded = await Promise.all(
                pending.map(({ file }) => uploadImage(file, signed)),
            );
        } catch {
            toast.danger(t('uploadError'));
            throw new Error('Upload failed');
        }

        pending.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
        setPending([]);
        setExisting((prev) => [...prev, ...uploaded]);
        return [...existing, ...uploaded];
    }

    useImperativeHandle(ref, () => ({ upload }));

    function addFiles(files: File[]) {
        const images = files.filter((file) =>
            IMAGE_ACCEPTED_TYPES.includes(file.type),
        );
        const picked = images.slice(
            0,
            maxFiles - existing.length - pending.length,
        );
        if (picked.some((file) => file.size > IMAGE_MAX_SIZE_MB * 1024 ** 2)) {
            toast.danger(t('tooLarge', { size: IMAGE_MAX_SIZE_MB }));
            return;
        }
        setPending((prev) => [
            ...prev,
            ...picked.map((file) => ({
                id: crypto.randomUUID(),
                file,
                previewUrl: URL.createObjectURL(file),
            })),
        ]);
    }

    const dropZone = {
        getDropOperation: (types) =>
            IMAGE_ACCEPTED_TYPES.some((type) => types.has(type))
                ? 'copy'
                : 'cancel',
        onDrop: async ({ items }) => {
            const files = await Promise.all(
                items.filter(isFileDropItem).map((item) => item.getFile()),
            );
            addFiles(files);
        },
    } satisfies Pick<DropZoneProps, 'getDropOperation' | 'onDrop'>;

    function selectFiles(files: FileList | null) {
        addFiles(Array.from(files ?? []));
    }

    function removeExisting(url: string) {
        setExisting((prev) => prev.filter((item) => item !== url));
    }

    function removePending(id: string) {
        setPending((prev) => {
            const target = prev.find((item) => item.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((item) => item.id !== id);
        });
    }

    return {
        existing,
        pending,
        canAddMore,
        dropZone,
        selectFiles,
        removeExisting,
        removePending,
    };
}
