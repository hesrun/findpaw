import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { Enums } from '@supabase/database.types';
import PetPlaceholder from '@UI/PetPlaceholder';

// Hero blobs: the white-rimmed blob shape spins, the face inside spins back
// at the same speed (`spin`, one turn), so only the outline turns. Each blob
// also drifts on its own loop (`float` duration, `drift` reach); different
// timings keep them out of step.
const BLOBS = [
    {
        species: 'cat',
        placement: 'w-[60%] left-[2%] top-[4%]',
        shape: 'rounded-[46%_54%_58%_42%/52%_44%_56%_48%]',
        spin: '24s',
        float: '11s',
        drift: '10px',
    },
    {
        species: 'dog',
        placement: 'w-[44%] right-0 top-0',
        shape: 'rounded-[55%_45%_40%_60%/50%_55%_45%_50%]',
        spin: '18s',
        float: '9s',
        drift: '-12px',
    },
    {
        species: 'rabbit',
        placement: 'w-[42%] right-[10%] bottom-0',
        shape: 'rounded-[42%_58%_52%_48%/58%_42%_58%_42%]',
        spin: '21s',
        float: '13s',
        drift: '14px',
    },
] satisfies {
    species: Enums<'pet_species'>;
    placement: string;
    shape: string;
    spin: string;
    float: string;
    drift: string;
}[];

// Decorative only, so it is hidden on phones where it would push the content down.
export default function HeroBlobs() {
    return (
        <div
            aria-hidden
            className="relative mx-auto hidden w-full max-w-md aspect-[1/0.92] md:block"
        >
            {BLOBS.map(({ species, placement, shape, spin, float, drift }) => (
                <div
                    key={species}
                    style={
                        {
                            '--blob-spin': spin,
                            '--blob-float': float,
                            '--drift': drift,
                        } as CSSProperties
                    }
                    className={clsx(
                        'absolute aspect-square drop-shadow-[0_12px_24px_rgba(76,29,149,0.14)] motion-safe:animate-[blob-float_var(--blob-float)_ease-in-out_infinite]',
                        placement,
                    )}
                >
                    <div
                        className={clsx(
                            'size-full overflow-hidden border-[6px] border-surface motion-safe:animate-[blob-spin_var(--blob-spin)_linear_infinite]',
                            shape,
                        )}
                    >
                        <div className="size-full motion-safe:animate-[blob-spin_var(--blob-spin)_linear_infinite_reverse]">
                            <PetPlaceholder
                                species={species}
                                className="overflow-visible"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
