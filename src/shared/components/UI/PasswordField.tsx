'use client';

import { useTranslations } from 'next-intl';
import {
    Button,
    FieldError,
    InputGroup,
    Label,
    TextField,
    type TextFieldProps,
} from '@heroui/react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { usePasswordVisibility } from '@shared/hooks/usePasswordVisibility';

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'children'> & {
    label: string;
    placeholder?: string;
};

// HeroUI password field (TextField + InputGroup) with a show/hide toggle,
// built as in the HeroUI docs.
export function PasswordField({
    label,
    placeholder,
    ...props
}: PasswordFieldProps) {
    const t = useTranslations('global');
    const { isVisible, toggle, type } = usePasswordVisibility();
    const Icon = isVisible ? LuEye : LuEyeOff;

    return (
        <TextField fullWidth {...props}>
            <Label>{label}</Label>
            <InputGroup fullWidth>
                <InputGroup.Input
                    type={type}
                    placeholder={placeholder ?? label}
                />
                <InputGroup.Suffix className="pe-0">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={t(isVisible ? 'hidePassword' : 'showPassword')}
                        onPress={toggle}
                    >
                        <Icon className="size-4" />
                    </Button>
                </InputGroup.Suffix>
            </InputGroup>
            <FieldError />
        </TextField>
    );
}
