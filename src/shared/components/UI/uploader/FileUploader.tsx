'use client';

import type { ReactNode, Ref } from 'react';
import { CloseButton } from '@heroui/react';
import { Button, DropZone, FileTrigger } from 'react-aria-components';
import { useTranslations } from 'next-intl';
import { MdPets } from 'react-icons/md';
import clsx from 'clsx';
import {
    IMAGE_ACCEPTED_TYPES,
    IMAGE_MAX_SIZE_MB,
    type ImageUploadFolder,
} from '@shared/constants/images';
import CloudImage from '../CloudImage';
import { useFileUploader, type FileUploaderRef } from './hooks/useFileUploader';

export type { FileUploaderRef };

type FileUploaderProps = {
    ref?: Ref<FileUploaderRef>;
    folder: ImageUploadFolder;
    maxFiles: number;
    currentFiles?: string[] | null;
    label?: string;
    icon?: ReactNode;
};

const previewClasses = 'relative aspect-square';
const imageClasses = 'w-full h-full object-cover rounded-2xl border';

// Image picker with drag and drop. The parent form calls `ref.upload()` on
// submit and saves the returned URLs.
export function FileUploader({
    ref,
    folder,
    maxFiles,
    currentFiles,
    label,
    icon = <MdPets className="w-10 h-10" />,
}: FileUploaderProps) {
    const t = useTranslations('uploader');
    const uploader = useFileUploader({ ref, folder, maxFiles, currentFiles });

    return (
        <div className="grid gap-2">
            {uploader.canAddMore && (
                <DropZone
                    {...uploader.dropZone}
                    aria-label={label ?? t('label')}
                    className={({ isDropTarget }) =>
                        clsx(
                            'rounded-2xl border-2 border-dashed border-accent text-accent transition-colors',
                            isDropTarget ? 'bg-accent/10' : 'hover:bg-accent/5',
                        )
                    }
                >
                    <FileTrigger
                        acceptedFileTypes={IMAGE_ACCEPTED_TYPES}
                        allowsMultiple={maxFiles > 1}
                        onSelect={uploader.selectFiles}
                    >
                        <Button className="w-full py-8 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl outline-none data-focus-visible:ring-2 data-focus-visible:ring-accent">
                            {icon}
                            <span>{label ?? t('label')}</span>
                            <span className="text-xs text-muted">
                                {t('limits', {
                                    size: IMAGE_MAX_SIZE_MB,
                                    count: maxFiles,
                                })}
                            </span>
                        </Button>
                    </FileTrigger>
                </DropZone>
            )}

            {uploader.existing.length + uploader.pending.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {uploader.existing.map((url) => (
                        <div key={url} className={previewClasses}>
                            <CloudImage
                                src={url}
                                alt=""
                                fill
                                sizes="160px"
                                className={imageClasses}
                            />
                            <CloseButton
                                aria-label={t('remove')}
                                className="absolute -right-2 -top-2"
                                onPress={() => uploader.removeExisting(url)}
                            />
                        </div>
                    ))}
                    {uploader.pending.map((item) => (
                        <div key={item.id} className={previewClasses}>
                            {/* A local blob: preview cannot go through an image loader. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.previewUrl}
                                alt=""
                                className={clsx(imageClasses, 'opacity-70')}
                            />
                            <span className="absolute inset-x-0 bottom-3 mx-auto w-fit text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                {t('notSaved')}
                            </span>
                            <CloseButton
                                aria-label={t('remove')}
                                className="absolute -right-2 -top-2"
                                onPress={() => uploader.removePending(item.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
