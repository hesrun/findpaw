import Image from 'next/image';
import HeaderAuth from './HeaderAuth';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderNav from './HeaderNav';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-surface text-foreground p-6 border-b border-border">
            <div className="container flex justify-between items-center">
                <Link href="/">
                    <Image
                        width={128}
                        height={32}
                        className="w-32 h-auto"
                        src="/logo/LogoColor.svg"
                        alt="logo"
                    />
                </Link>
                <HeaderNav />
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <HeaderAuth />
                </div>
            </div>
        </header>
    );
}
