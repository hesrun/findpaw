import { z } from 'zod';
import { CLOUDINARY_UPLOAD_URL } from '@shared/constants/images';
import type { SignedUpload } from './actions';

const UploadResponseSchema = z.object({ secure_url: z.string().url() });

// Uploads one file from the browser with a signature from signImageUpload
// and returns its delivery URL.
export async function uploadImage(
    file: File,
    { apiKey, signature, params }: SignedUpload,
): Promise<string> {
    const body = new FormData();
    body.append('file', file);
    body.append('api_key', apiKey);
    body.append('signature', signature);
    for (const [key, value] of Object.entries(params)) {
        body.append(key, value);
    }

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body,
    });
    if (!response.ok) throw new Error('Upload failed');

    return UploadResponseSchema.parse(await response.json()).secure_url;
}
