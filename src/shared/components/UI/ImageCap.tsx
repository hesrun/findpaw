import { useTranslations } from 'next-intl';
import { FaPaw } from 'react-icons/fa';

export default function ImageCap() {
    const global = useTranslations('global');
    return (
        <div className="aspect-2/1.5 flex items-center justify-center text-accent/50 flex-col gap-2 bg-accent/10 rounded-lg">
            <div className="flex text-6xl gap-3">
                <FaPaw className="-rotate-15" />
                <FaPaw className="rotate-15" />
            </div>
            <span className="text-2xl font-heading font-bold">
                {global('noPhoto')}
            </span>
        </div>
    );
}
