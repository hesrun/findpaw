import { buttonVariants, Link } from '@heroui/react';
import { LuArrowBigRight, LuArrowRight } from 'react-icons/lu';

export default function HeroSection() {
    return (
        <section>
            <div className="container">
                <div className="bg-white rounded-[2rem] overflow-hidden relative contain-inline-size">
                    <div className="absolute inset-0 z-0">
                        <div className="bg-accent/40 w-40 aspect-1/2 absolute -top-10 -left-10 rounded-[40%] blur-3xl"></div>
                        <div className="bg-accent/30 w-40 aspect-1/2 absolute -bottom-10 -right-10 rounded-[40%] blur-3xl"></div>
                    </div>
                    <div className="relative grid gap-[5cqw] lg:gap-[3cqw] place-content-center p-[5cqw] lg:min-h-[calc(100vh-10rem)]">
                        <h1
                            className="text-[8cqw] lg:text-[5cqw]  font-black font-nunito text-center text-balance leading-none tracking-tight
"
                        >
                            Find your missing pet or give a warm home to a{' '}
                            <br />
                            <span className="bg-linear-to-r from-accent via-violet-700 to-indigo-500 bg-clip-text text-transparent">
                                new companion
                            </span>
                        </h1>
                        <p className="text-center text-muted lg:max-w-1/2 mx-auto ">
                            Browse listings from verified shelters and pet
                            owners, or report a lost pet in minutes — your
                            neighborhood is looking too.
                        </p>
                        <div className="text-center">
                            <Link
                                href="/pets"
                                className={buttonVariants({
                                    size: 'lg',
                                    variant: 'primary',
                                })}
                            >
                                Browse pets
                                <LuArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
