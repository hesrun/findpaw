import HeaderAuth from './HeaderAuth';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    return (
        <header className="bg-white text-black p-4 flex justify-between items-center border-b border-border">
            <span className="text-2xl font-bold">Pet Finder</span>
            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <HeaderAuth />
            </div>
        </header>
    );
}
