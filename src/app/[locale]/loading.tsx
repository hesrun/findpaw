import { IoPaw } from 'react-icons/io5';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center flex-col justify-center bg-white/80 z-50">
            <div className="flex gap-2 mb-4">
                <IoPaw
                    className="text-xl text-accent rotate-[70deg] mt-4"
                    style={{
                        animation: 'pawstep 1.6s ease-in-out infinite',
                        animationDelay: '0s',
                    }}
                />
                <IoPaw
                    className="text-xl text-accent rotate-[110deg]"
                    style={{
                        animation: 'pawstep 1.6s ease-in-out infinite',
                        animationDelay: '0.4s',
                    }}
                />
                <IoPaw
                    className="text-xl text-accent rotate-[70deg] mt-4"
                    style={{
                        animation: 'pawstep 1.6s ease-in-out infinite',
                        animationDelay: '0.8s',
                    }}
                />
                <IoPaw
                    className="text-xl text-accent rotate-[110deg]"
                    style={{
                        animation: 'pawstep 1.6s ease-in-out infinite',
                        animationDelay: '1.2s',
                    }}
                />
            </div>
            <p className="text-xl uppercase font-heading font-bold text-accent tracking-widest">
                Loading
            </p>
        </div>
    );
}
