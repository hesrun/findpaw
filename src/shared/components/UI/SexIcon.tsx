import { Enums } from '@supabase/database.types';
import { clsx } from 'clsx';
import { IoFemale, IoMale } from 'react-icons/io5';
import { FaQuestion } from 'react-icons/fa';

interface SexIconProps {
    sex: Enums<'pet_sex'>;
}

const SEX_CONFIG = {
    male: {
        icon: IoMale,
        className: 'bg-blue-500 ',
    },
    female: {
        icon: IoFemale,
        className: 'bg-pink-500',
    },
    unknown: {
        icon: FaQuestion,
        className: 'bg-gray-500',
    },
} as const;

export default function SexIcon({ sex }: SexIconProps) {
    const config = SEX_CONFIG[sex] ?? SEX_CONFIG.unknown;
    const IconComponent = config.icon;

    return (
        <div
            className={clsx(
                'inline-flex text-white p-1 rounded-full ',
                config.className,
            )}
        >
            <IconComponent />
        </div>
    );
}
