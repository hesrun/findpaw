import 'server-only';
import { createHash } from 'node:crypto';
import {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_IMAGE_URL_PREFIX,
    type ImageUploadFolder,
} from '@shared/constants/images';

// Cloudinary signature: SHA-1 of the sorted "key=value" pairs plus the secret.
export function signParams(params: Record<string, string>) {
    const payload = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&');
    return createHash('sha1')
        .update(payload + process.env.CLOUDINARY_API_SECRET)
        .digest('hex');
}

export function userFolder(folder: ImageUploadFolder, userId: string) {
    return `${folder}/${userId}`;
}

// ".../image/upload/v1712345/pets/<user>/abc.jpg" -> "pets/<user>/abc"
function publicIdOf(url: string) {
    return url
        .slice(CLOUDINARY_IMAGE_URL_PREFIX.length)
        .replace(/^v\d+\//, '')
        .replace(/\.[^/.]+$/, '');
}

// Images a save removed: in `before` but no longer in `after`.
export function removedImages(
    before: string[] | null | undefined,
    after: string[] | null | undefined,
) {
    return (before ?? []).filter((url) => !after?.includes(url));
}

// Deletes images from Cloudinary, but only those inside the user's own
// folder: any URL from our cloud may be saved on a listing, and removing it
// there must not delete another user's file. Older images outside user
// folders are left in place. Failures are logged, never thrown: the
// database change has already succeeded.
export async function deleteUserImages(
    urls: string[],
    folder: ImageUploadFolder,
    userId: string,
) {
    const prefix = `${userFolder(folder, userId)}/`;
    const publicIds = urls
        .filter((url) => url.startsWith(CLOUDINARY_IMAGE_URL_PREFIX))
        .map(publicIdOf)
        .filter((publicId) => publicId.startsWith(prefix));

    await Promise.all(
        publicIds.map(async (publicId) => {
            const params = {
                public_id: publicId,
                timestamp: String(Math.floor(Date.now() / 1000)),
            };
            const body = new URLSearchParams({
                ...params,
                api_key: process.env.CLOUDINARY_API_KEY ?? '',
                signature: signParams(params),
            });
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
                { method: 'POST', body },
            ).catch(() => null);
            if (!response?.ok) {
                console.error('[deleteUserImages] failed', publicId);
            }
        }),
    );
}
