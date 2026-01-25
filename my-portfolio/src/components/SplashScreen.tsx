
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Fade out the entire container before calling onComplete
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: onComplete
                });
            }
        });

        // Initial state
        gsap.set(containerRef.current, { opacity: 1 });
        gsap.set(textRef.current, { opacity: 0, y: 50 });
        gsap.set(progressRef.current, { scaleX: 0 });

        // Animation sequences
        tl.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        })
            .to(progressRef.current, {
                scaleX: 1,
                duration: 1.5,
                ease: "power1.inOut"
            })
            .to(textRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                delay: 0.2
            });

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
        >
            <h1
                ref={textRef}
                className="text-4xl md:text-6xl font-bold tracking-wider mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            >
                MIRANG
            </h1>

            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    ref={progressRef}
                    className="h-full bg-white origin-left"
                />
            </div>
        </div>
    );
};

export default SplashScreen;
