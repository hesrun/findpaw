// The "0" of the 404 page: a ginger cat seen from behind on a little oval
// stage, tail up, with an asterisk where the joke is. Curtains use the accent.
const FUR = '#f2b36b';
const FUR_DARK = '#dc8f45';
const STRIPE = '#c97a35';
const MARK = '#7a3d12';

export default function NotFoundCat({ label }: { label: string }) {
    return (
        <svg
            viewBox="0 0 200 240"
            role="img"
            aria-label={label}
            className="block h-auto w-full"
        >
            <defs>
                {/* Tall rounded shape so the stage reads as a "0". */}
                <clipPath id="not-found-stage">
                    <rect x="0" y="0" width="200" height="240" rx="84" />
                </clipPath>
            </defs>

            <g clipPath="url(#not-found-stage)">
                <rect width="200" height="240" fill="var(--soft)" />
                <rect y="214" width="200" height="26" fill="var(--hero)" />

                <g transform="translate(0 18)">
                    {/* Feet peeking out under the haunches */}
                    <ellipse cx="84" cy="197" rx="9" ry="4.5" fill={FUR_DARK} />
                    <ellipse cx="116" cy="197" rx="9" ry="4.5" fill={FUR_DARK} />

                    {/* Body and haunches */}
                    <ellipse cx="100" cy="152" rx="35" ry="40" fill={FUR} />
                    <ellipse cx="79" cy="176" rx="17" ry="19" fill={FUR} />
                    <ellipse cx="121" cy="176" rx="17" ry="19" fill={FUR} />

                    {/* Tabby stripes on the back */}
                    <path
                        d="M84 126 Q100 120 116 126 M80 140 Q100 133 120 140 M78 154 Q100 147 122 154"
                        stroke={STRIPE}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Head from behind: no face, just ears */}
                    <path d="M79 100 L83 70 L98 86 Z" fill={FUR} />
                    <path d="M121 100 L117 70 L102 86 Z" fill={FUR} />
                    <path d="M82.5 92 L84.5 77 L92 85 Z" fill={FUR_DARK} />
                    <path d="M117.5 92 L115.5 77 L108 85 Z" fill={FUR_DARK} />
                    <circle cx="100" cy="104" r="24" fill={FUR} />
                    <path
                        d="M92 90 Q100 86 108 90 M90 99 Q100 94 110 99"
                        stroke={STRIPE}
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Tail up, out of the way */}
                    <path
                        d="M100 178 C100 150 136 150 136 118 C136 100 146 92 154 100"
                        stroke={FUR}
                        strokeWidth="11"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        d="M146 94 C150 92 153 95 154 100"
                        stroke={STRIPE}
                        strokeWidth="11"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* The asterisk */}
                    <g
                        stroke={MARK}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        transform="translate(100 187)"
                    >
                        <line x1="0" y1="-5" x2="0" y2="5" />
                        <line x1="-4.3" y1="-2.5" x2="4.3" y2="2.5" />
                        <line x1="-4.3" y1="2.5" x2="4.3" y2="-2.5" />
                    </g>
                </g>

                {/* Curtains, drawn last so they frame the cat */}
                <g fill="var(--accent)">
                    <path d="M0 0 H34 C24 80 44 150 24 226 L22 240 H0 Z" />
                    <path d="M200 0 H166 C176 80 156 150 176 226 L178 240 H200 Z" />
                    <path d="M0 0 H200 V18 Q187.5 32 175 18 Q162.5 32 150 18 Q137.5 32 125 18 Q112.5 32 100 18 Q87.5 32 75 18 Q62.5 32 50 18 Q37.5 32 25 18 Q12.5 32 0 18 Z" />
                </g>
                <path
                    d="M10 28 C7 100 15 170 9 240 M22 28 C18 100 30 170 20 240 M190 28 C193 100 185 170 191 240 M178 28 C182 100 170 170 180 240"
                    stroke="black"
                    strokeOpacity="0.15"
                    strokeWidth="2.5"
                    fill="none"
                />
            </g>
        </svg>
    );
}
