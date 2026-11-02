import Image from 'next/image';
import HeaderAuth from './HeaderAuth';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderNav from './HeaderNav';
import HeaderMobileMenu from './HeaderMobileMenu';
import { Link } from '@/i18n/navigation';

export default function Header() {
    return (
        <header className="bg-surface text-foreground px-4 py-3 sm:p-6 border-b border-border">
            <div className="container flex justify-between items-center gap-4">
                <Link href="/" className="shrink-0">
                    <Image
                        width={128}
                        height={32}
                        className="w-28 sm:w-32 h-auto"
                        src="/logo/LogoColor.svg"
                        alt="logo"
                    />
                </Link>
                <HeaderNav />
                <div className="flex items-center gap-2 sm:gap-4">
                    <LanguageSwitcher />
                    <HeaderAuth />
                    <HeaderMobileMenu />
                </div>
            </div>
        </header>
    );
}
