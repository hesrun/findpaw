import type { FileUploaderRef } from './hooks/useFileUploader';

// Uploads the picked files and puts every URL to save under `key`.
// Throws (after a toast) when an upload fails.
export async function uploadToFormData(
    uploader: FileUploaderRef | null,
    formData: FormData,
    key: string,
) {
    const urls = (await uploader?.upload()) ?? [];
    formData.delete(key);
    urls.forEach((url) => formData.append(key, url));
}
