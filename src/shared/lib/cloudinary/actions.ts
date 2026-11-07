'use server';

import { z } from 'zod';
import getSupabaseWithUser from '@shared/lib/supabase/auth';
import {
    IMAGE_ALLOWED_FORMATS,
    IMAGE_UPLOAD_FOLDERS,
    IMAGE_UPLOAD_TRANSFORMATIONS,
    type ImageUploadFolder,
} from '@shared/constants/images';
import { signParams, userFolder } from './server';

export type SignedUpload = {
    apiKey: string;
    signature: string;
    params: Record<string, string>;
};

// Lets a signed-in user upload images straight from the browser into their
// own folder. Cloudinary rejects the upload if any signed parameter is
// changed; a signature is valid for one hour.
export async function signImageUpload(
    folder: ImageUploadFolder,
): Promise<SignedUpload> {
    const topFolder = z.enum(IMAGE_UPLOAD_FOLDERS).parse(folder);
    const { user } = await getSupabaseWithUser();

    const transformation = IMAGE_UPLOAD_TRANSFORMATIONS[topFolder];
    const params: Record<string, string> = {
        folder: userFolder(topFolder, user.id),
        timestamp: String(Math.floor(Date.now() / 1000)),
        allowed_formats: IMAGE_ALLOWED_FORMATS.join(','),
        ...(transformation && { transformation }),
    };

    return {
        apiKey: process.env.CLOUDINARY_API_KEY ?? '',
        signature: signParams(params),
        params,
    };
}
