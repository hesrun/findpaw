import { z } from 'zod';
import { imageUrls } from '@shared/lib/form';
import { USER_NAME_MIN_LENGTH } from '@features/auth/constants';
import { PhoneSchema } from '@features/auth/schemas';
import { AVATAR_MAX_FILES, PROFILE_NAME_MAX_LENGTH } from './constants';

// A subset of the columns users may update (see the profiles grant); the
// role is never part of this form, and `city` is not used for now.
export const ProfileFormSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(USER_NAME_MIN_LENGTH)
        .max(PROFILE_NAME_MAX_LENGTH),
    phone: PhoneSchema,
    avatar_url: imageUrls(AVATAR_MAX_FILES).transform(
        (urls) => urls?.[0] ?? null,
    ),
});

export type ProfileForm = z.infer<typeof ProfileFormSchema>;
