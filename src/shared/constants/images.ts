// Images are stored in Cloudinary and uploaded from the browser with a
// signature from the server (signImageUpload). The cloud name is public.
export const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Saved image URLs must start with this: only images from our own cloud.
export const CLOUDINARY_IMAGE_URL_PREFIX = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

// Top-level upload folders; the server appends the user id, so every user
// uploads only into their own folder.
export const IMAGE_UPLOAD_FOLDERS = ['pets', 'shelters', 'avatars'] as const;
export type ImageUploadFolder = (typeof IMAGE_UPLOAD_FOLDERS)[number];

// Incoming transformations: Cloudinary applies them on upload, so the stored
// image is already cropped. Avatars become a square around the subject.
export const IMAGE_UPLOAD_TRANSFORMATIONS: Partial<
    Record<ImageUploadFolder, string>
> = {
    avatars: 'c_fill,g_auto,w_512,h_512',
};

// Enforced by Cloudinary through the signed upload parameters.
export const IMAGE_ALLOWED_FORMATS = ['jpg', 'png', 'webp', 'avif', 'heic'];

// File picker and drop zone filter; mirrors IMAGE_ALLOWED_FORMATS.
export const IMAGE_ACCEPTED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/heic',
];

export const IMAGE_MAX_SIZE_MB = 5;
