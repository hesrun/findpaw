'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { CloseButton, toast } from '@heroui/react';
import { MdPets } from 'react-icons/md';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type PendingFile = {
    id: string;
    file: File;
    previewUrl: string;
};

type ExistingFile = {
    id: string;
    url: string;
};

export type FileUploaderRef = {
    upload: () => Promise<string[]>;
};

type FileUploaderProps = {
    label?: string;
    hint?: string;
    icon?: React.ReactNode;
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMB?: number;
    folder?: string;
    currentFile?: string | null;
    currentFiles?: string[] | null;
};

async function uploadToCloudinary(
    file: File,
    folder?: string,
): Promise<string> {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', UPLOAD_PRESET!);
    if (folder) body.append('folder', folder);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body },
    );
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url as string;
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
    function FileUploader(
        {
            label = 'Upload photo',
            hint,
            icon = <MdPets className="w-10 h-10" />,
            multiple = false,
            maxFiles = 1,
            maxSizeMB = 5,
            folder,
            currentFile,
            currentFiles,
        },
        ref,
    ) {
        const inputRef = useRef<HTMLInputElement>(null);

        const [existing, setExisting] = useState<ExistingFile[]>(() => {
            const urls = currentFiles?.length
                ? currentFiles
                : currentFile
                  ? [currentFile]
                  : [];
            return urls.map((url) => ({ id: url, url }));
        });

        const [pending, setPending] = useState<PendingFile[]>([]);

        const limit = multiple ? maxFiles : 1;
        const canAddMore = existing.length + pending.length < limit;

        useImperativeHandle(ref, () => ({
            async upload(): Promise<string[]> {
                if (!pending.length) {
                    return existing.map((e) => e.url);
                }

                let uploaded: string[];
                try {
                    uploaded = await Promise.all(
                        pending.map((p) => uploadToCloudinary(p.file, folder)),
                    );
                } catch {
                    toast.danger('Failed to upload one or more images');
                    throw new Error('Upload failed');
                }

                pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
                setPending([]);

                const newExisting = uploaded.map((url) => ({ id: url, url }));
                setExisting((prev) => [...prev, ...newExisting]);

                return [...existing.map((e) => e.url), ...uploaded];
            },
        }));

        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            const selected = Array.from(e.target.files ?? []);
            e.target.value = '';

            const remaining = limit - existing.length - pending.length;
            const picked = selected.slice(0, remaining);

            const oversized = picked.filter(
                (f) => f.size > maxSizeMB * 1024 * 1024,
            );
            if (oversized.length) {
                toast.danger(`Max file size is ${maxSizeMB}MB`);
                return;
            }

            const entries: PendingFile[] = picked.map((f) => ({
                id: crypto.randomUUID(),
                file: f,
                previewUrl: URL.createObjectURL(f),
            }));

            setPending((prev) => [...prev, ...entries]);
        }

        function removeExisting(id: string) {
            setExisting((prev) => prev.filter((f) => f.id !== id));
        }

        function removePending(id: string) {
            setPending((prev) => {
                const target = prev.find((f) => f.id === id);
                if (target) URL.revokeObjectURL(target.previewUrl);
                return prev.filter((f) => f.id !== id);
            });
        }

        const previewHeight = multiple ? 'h-[160px]' : 'h-[320px]';
        const previewGrid = multiple ? 'grid grid-cols-3 gap-2' : 'grid gap-2';
        const allCount = existing.length + pending.length;

        return (
            <div className="grid gap-2">
                <input
                    ref={inputRef}
                    type="file"
                    title="Upload image"
                    accept="image/*"
                    multiple={multiple}
                    className="hidden"
                    onChange={handleChange}
                />

                {canAddMore && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="border-2 rounded-2xl border-accent py-8 border-dashed flex items-center justify-center cursor-pointer flex-col gap-2 text-accent hover:bg-accent/5 transition-colors"
                    >
                        {icon}
                        <span>{label}</span>
                        {hint ? (
                            <span className="text-xs text-muted">{hint}</span>
                        ) : (
                            <span className="text-xs text-muted">
                                Max {maxSizeMB}MB
                                {multiple &&
                                    limit > 1 &&
                                    ` · up to ${limit} photos`}
                            </span>
                        )}
                    </button>
                )}

                {allCount > 0 && (
                    <div className={previewGrid}>
                        {existing.map((f) => (
                            <div
                                key={f.id}
                                className={`relative ${previewHeight}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={f.url}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-2xl border"
                                />
                                <CloseButton
                                    className="absolute -right-2 -top-2"
                                    onPress={() => removeExisting(f.id)}
                                />
                            </div>
                        ))}
                        {pending.map((f) => (
                            <div
                                key={f.id}
                                className={`relative ${previewHeight}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={f.previewUrl}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-2xl border opacity-70"
                                />
                                <div className="absolute inset-0 flex items-end justify-center pb-3 rounded-2xl">
                                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                        Not saved yet
                                    </span>
                                </div>
                                <CloseButton
                                    className="absolute -right-2 -top-2"
                                    onPress={() => removePending(f.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    },
);
