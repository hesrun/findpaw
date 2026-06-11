'use client';

import { Button } from '@heroui/react';
import { signOut } from '@/features/auth/actions/actions';

export default function SignOutButton({ label }: { label: string }) {
    return (
        <Button size="sm" onPress={() => signOut()}>
            {label}
        </Button>
    );
}
