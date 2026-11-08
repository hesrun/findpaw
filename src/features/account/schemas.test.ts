import { describe, expect, it } from 'vitest';
import { CLOUDINARY_IMAGE_URL_PREFIX } from '@shared/constants/images';
import { PROFILE_NAME_MAX_LENGTH } from './constants';
import { ProfileFormSchema } from './schemas';

const avatar = `${CLOUDINARY_IMAGE_URL_PREFIX}avatar.jpg`;

describe('ProfileFormSchema', () => {
    it('keeps a single avatar URL instead of an array', () => {
        expect(
            ProfileFormSchema.parse({
                full_name: ' Jana ',
                phone: '',
                avatar_url: [avatar],
            }),
        ).toEqual({ full_name: 'Jana', phone: null, avatar_url: avatar });
    });

    it('saves a removed avatar as null', () => {
        expect(
            ProfileFormSchema.parse({ full_name: 'Jana', avatar_url: [] })
                .avatar_url,
        ).toBeNull();
    });

    it('rejects a second avatar', () => {
        expect(
            ProfileFormSchema.safeParse({
                full_name: 'Jana',
                avatar_url: [avatar, avatar],
            }).success,
        ).toBe(false);
    });

    it('limits the name length', () => {
        expect(
            ProfileFormSchema.safeParse({
                full_name: 'J'.repeat(PROFILE_NAME_MAX_LENGTH + 1),
            }).success,
        ).toBe(false);
    });

    it('drops fields outside the form, such as role', () => {
        expect(
            ProfileFormSchema.parse({ full_name: 'Jana', role: 'admin' }),
        ).not.toHaveProperty('role');
    });
});
