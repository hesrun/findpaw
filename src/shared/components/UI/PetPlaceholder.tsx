import type { Enums } from '@supabase/database.types';
import clsx from 'clsx';
import type { ReactNode } from 'react';

// Flat, low-contrast stand-ins for listings without a photo: a backdrop tone,
// fur half a step darker, features one more step darker.
type Palette = { bg: string; fur: string; feat: string };
type Art = (p: Palette) => ReactNode;

const PALETTES = {
    lilac: { bg: '#efe9fb', fur: '#ddd2f3', feat: '#bcaee0' },
    peach: { bg: '#fbf1e6', fur: '#eedac2', feat: '#cfae8a' },
    mint: { bg: '#edf4f0', fur: '#d8e4dd', feat: '#afc2b7' },
    butter: { bg: '#fbf6e6', fur: '#efe3bf', feat: '#d3bf88' },
    sky: { bg: '#eef3fb', fur: '#d8e2f3', feat: '#afc1e0' },
} satisfies Record<string, Palette>;

const cat: Art = ({ fur, feat }) => (
    <>
        <path d="M50 58 L46 18 L76 38 Z M110 58 L114 18 L84 38 Z" fill={fur} />
        <ellipse cx="80" cy="70" rx="38" ry="33" fill={fur} />
        <ellipse cx="66" cy="66" rx="4" ry="5.5" fill={feat} />
        <ellipse cx="94" cy="66" rx="4" ry="5.5" fill={feat} />
        <path d="M76 78 L84 78 L80 83 Z" fill={feat} />
    </>
);

const dog: Art = ({ fur, feat }) => (
    <>
        <path
            d="M50 36 C36 40 34 70 42 82 C48 90 58 82 58 70 Z M110 36 C124 40 126 70 118 82 C112 90 102 82 102 70 Z"
            fill={feat}
            opacity="0.55"
        />
        <ellipse cx="80" cy="62" rx="32" ry="34" fill={fur} />
        <circle cx="68" cy="58" r="4" fill={feat} />
        <circle cx="92" cy="58" r="4" fill={feat} />
        <ellipse cx="80" cy="74" rx="7" ry="5" fill={feat} />
    </>
);

const rabbit: Art = ({ fur, feat }) => (
    <>
        <ellipse cx="66" cy="34" rx="10" ry="28" transform="rotate(-8 66 34)" fill={fur} />
        <ellipse cx="94" cy="34" rx="10" ry="28" transform="rotate(8 94 34)" fill={fur} />
        <circle cx="80" cy="78" r="30" fill={fur} />
        <circle cx="69" cy="74" r="3.6" fill={feat} />
        <circle cx="91" cy="74" r="3.6" fill={feat} />
        <ellipse cx="80" cy="85" rx="4.5" ry="3.2" fill={feat} />
    </>
);

const rodent: Art = ({ fur, feat }) => (
    <>
        <circle cx="56" cy="42" r="11" fill={fur} />
        <circle cx="104" cy="42" r="11" fill={fur} />
        <ellipse cx="80" cy="70" rx="40" ry="33" fill={fur} />
        <circle cx="68" cy="64" r="3.6" fill={feat} />
        <circle cx="92" cy="64" r="3.6" fill={feat} />
        <ellipse cx="80" cy="76" rx="4" ry="3" fill={feat} />
    </>
);

const bird: Art = ({ fur, feat }) => (
    <>
        <path d="M74 30 C76 20 84 18 86 26 C84 24 80 26 80 32 Z" fill={fur} />
        <circle cx="80" cy="66" r="34" fill={fur} />
        <circle cx="68" cy="60" r="3.6" fill={feat} />
        <circle cx="92" cy="60" r="3.6" fill={feat} />
        <path d="M74 70 L86 70 L80 80 Z" fill={feat} />
    </>
);

const fish: Art = ({ fur, feat }) => (
    <>
        <path d="M112 62 L134 44 L134 80 Z" fill={feat} opacity="0.6" />
        <ellipse cx="78" cy="62" rx="40" ry="26" fill={fur} />
        <circle cx="58" cy="58" r="4" fill={feat} />
        <path d="M84 50 C90 58 90 66 84 74" fill="none" stroke={feat} strokeWidth="3" strokeLinecap="round" />
    </>
);

const ferret: Art = ({ fur, feat }) => (
    <>
        <circle cx="56" cy="44" r="9" fill={fur} />
        <circle cx="104" cy="44" r="9" fill={fur} />
        <ellipse cx="80" cy="66" rx="34" ry="30" fill={fur} />
        <path d="M50 62 C60 54 100 54 110 62 C100 70 60 70 50 62 Z" fill={feat} opacity="0.45" />
        <circle cx="68" cy="62" r="3.4" fill={feat} />
        <circle cx="92" cy="62" r="3.4" fill={feat} />
        <ellipse cx="80" cy="80" rx="4.5" ry="3.2" fill={feat} />
    </>
);

const reptile: Art = ({ fur, feat }) => (
    <>
        <circle cx="122" cy="74" r="11" fill={fur} />
        <circle cx="126" cy="72" r="2.4" fill={feat} />
        <rect x="46" y="80" width="12" height="16" rx="6" fill={fur} />
        <rect x="96" y="80" width="12" height="16" rx="6" fill={fur} />
        <path d="M36 86 C36 50 118 50 118 86 Z" fill={feat} opacity="0.7" />
        <path d="M58 62 L77 56 L96 62 M66 76 L77 62 L88 76" fill="none" stroke={fur} strokeWidth="3" strokeLinecap="round" />
    </>
);

const horse: Art = ({ fur, feat }) => (
    <>
        <path d="M64 34 L62 14 L74 28 Z M96 34 L98 14 L86 28 Z" fill={fur} />
        <path d="M70 26 C78 20 88 22 92 30 C86 30 80 34 76 40 Z" fill={feat} opacity="0.55" />
        <ellipse cx="80" cy="64" rx="24" ry="38" fill={fur} />
        <circle cx="69" cy="52" r="3.6" fill={feat} />
        <circle cx="91" cy="52" r="3.6" fill={feat} />
        <ellipse cx="73" cy="88" rx="3" ry="4" fill={feat} />
        <ellipse cx="87" cy="88" rx="3" ry="4" fill={feat} />
    </>
);

const paw: Art = ({ fur }) => (
    <g fill={fur}>
        <ellipse cx="80" cy="76" rx="20" ry="17" />
        <ellipse cx="58" cy="54" rx="8" ry="10" />
        <ellipse cx="72" cy="42" rx="8" ry="10" />
        <ellipse cx="88" cy="42" rx="8" ry="10" />
        <ellipse cx="102" cy="54" rx="8" ry="10" />
    </g>
);

const SPECIES_ART = {
    cat: { art: cat, palette: PALETTES.lilac },
    dog: { art: dog, palette: PALETTES.peach },
    rabbit: { art: rabbit, palette: PALETTES.mint },
    rodent: { art: rodent, palette: PALETTES.butter },
    bird: { art: bird, palette: PALETTES.sky },
    fish: { art: fish, palette: PALETTES.sky },
    ferret: { art: ferret, palette: PALETTES.peach },
    reptile: { art: reptile, palette: PALETTES.mint },
    horse: { art: horse, palette: PALETTES.butter },
    other: { art: paw, palette: PALETTES.lilac },
} satisfies Record<Enums<'pet_species'>, { art: Art; palette: Palette }>;

// Full scene is 160x120; `round` crops a square around the head for avatars.
const VIEWBOX = { scene: '0 0 160 120', round: '30 14 100 100' };

export default function PetPlaceholder({
    species,
    round = false,
    className,
}: {
    species: Enums<'pet_species'>;
    round?: boolean;
    className?: string;
}) {
    const { art, palette } = SPECIES_ART[species] ?? SPECIES_ART.other;

    return (
        <svg
            viewBox={round ? VIEWBOX.round : VIEWBOX.scene}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            className={clsx('block w-full h-full', className)}
        >
            <rect x="0" y="0" width="160" height="120" fill={palette.bg} />
            {art(palette)}
        </svg>
    );
}

export function ShelterPlaceholder({ className }: { className?: string }) {
    const { bg, fur, feat } = PALETTES.lilac;

    return (
        <svg
            viewBox={VIEWBOX.scene}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            className={clsx('block w-full h-full', className)}
        >
            <rect x="0" y="0" width="160" height="120" fill={bg} />
            <path d="M40 60 L80 28 L120 60 L120 104 L40 104 Z" fill={fur} />
            <rect x="70" y="78" width="20" height="26" rx="10" fill={feat} />
            <g fill={feat}>
                <ellipse cx="80" cy="56" rx="6" ry="5" />
                <ellipse cx="72" cy="49" rx="2.4" ry="3" />
                <ellipse cx="77" cy="46" rx="2.4" ry="3" />
                <ellipse cx="83" cy="46" rx="2.4" ry="3" />
                <ellipse cx="88" cy="49" rx="2.4" ry="3" />
            </g>
        </svg>
    );
}
