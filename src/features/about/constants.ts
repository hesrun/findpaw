import { TbHomeShield } from 'react-icons/tb';
import { FaRegUserCircle } from 'react-icons/fa';

// Audience cards; text lives in aboutPage.audience.<key>.
export const ABOUT_AUDIENCE = [
    { key: 'owners', icon: FaRegUserCircle },
    { key: 'shelters', icon: TbHomeShield },
] as const;
