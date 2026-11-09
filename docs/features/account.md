# Account Feature

## Responsibilities

The account feature owns the signed-in user's settings page (`/dashboard/settings`): profile data (name, phone), the profile photo, and the password change form. Sign-in, sign-up, and password recovery stay in the auth feature.

## Domain Rules

- A user edits only their own `profiles` row (`id = auth.uid()` in RLS, plus `eq('id', user.id)` in the action).
- Only `full_name`, `avatar_url`, and `phone` are editable. The grant also allows `city`, but the form leaves it out for now. The role is never part of the form.
- The phone is optional; it can also be given at sign-up (the `handle_new_user` trigger copies it from metadata into the profile, trimmed and capped). `PhoneSchema` (auth schemas) validates it in both forms.
- The phone, or the sign-in email when there is no phone, is the contact behind "Show contact" on the user's private listings (see `docs/features/pets.md`). Both prefill a new shelter's contacts.
- Changing the sign-in email requires the current password (`changeEmail`, auth actions). Supabase emails a confirmation link (`email_change` template) and changes the email only after it is opened; the confirm route then returns to settings.
- The page has two tabs: profile (photo, personal data, sign-in email) and password.
- One profile photo, stored in the Cloudinary `avatars/<user id>` folder. Cloudinary crops it to a 512 px square on upload (`IMAGE_UPLOAD_TRANSFORMATIONS`), and the uploader shows it as a circle (`round`). A replaced or removed photo is deleted after the response (`deleteUserImages`).
- Changing the password requires the current one. Supabase does not ask for it, so `changePassword` (auth actions) signs in with it first; `changeEmail` shares the same `reauthenticate` step.
- Account deletion is still handled by email request (see `docs/decisions.md`, legal pages).

## Access Patterns

- The page reads the profile with `getProfile()` and the email with `getCurrentUser()`; no feature query is needed.
- `updateProfile` revalidates the root layout, because the header shows the name and photo on every page.
- Profile rows are never public: the profiles select policy is owner-only. Only the contact of authors of public listings leaves through the `get_pet_owner_contact` function.

## Decisions

- `changePassword` lives in the auth feature next to `updatePassword`, sharing `AuthResult`, the `auth.errors.*` keys, and the new-password schema; `changeEmail` sits next to them for the same reason.
