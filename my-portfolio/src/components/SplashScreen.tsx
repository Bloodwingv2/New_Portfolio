
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const subTextRef = useRef<HTMLParagraphElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLParagraphElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: onComplete
        });

        const letters = letterRefs.current;

        // Initial states
        gsap.set(containerRef.current, { opacity: 1 });
        gsap.set(letters, { y: 120, opacity: 0, scale: 0.8 });
        gsap.set(subTextRef.current, { opacity: 0, y: 30 });
        gsap.set(loaderRef.current, { scaleX: 0, transformOrigin: "left" });
        gsap.set(hintRef.current, { opacity: 0, y: 10 });
        gsap.set(overlayRef.current, { yPercent: 100 });

        // Animation Sequence
        tl.to(letters, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.08,
            ease: "power3.out"
        })
            .to(letters, {
                color: "#ffffff", // Animate to pure white
                duration: 0.5,
                ease: "power2.inOut"
            }, "-=0.8")
            .to(subTextRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.6")
            .to(loaderRef.current, {
                scaleX: 1,
                duration: 1.5,
                ease: "expo.inOut"
            })
            .to(hintRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            }, "-=0.5")
            // Exit sequence
            .to([loaderRef.current, hintRef.current], {
                opacity: 0,
                duration: 0.3
            })
            .to(loaderRef.current, {
                scaleY: 0,
                transformOrigin: "bottom",
                duration: 0.3,
                ease: "power2.in"
            }, "<")
            .to(containerRef.current, {
                opacity: 0,
                scale: 1.05,
                duration: 0.8,
                ease: "power2.inOut"
            }, "-=0.2");

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    const mainText = "MIRANG";

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white isolate overflow-hidden"
        >
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-700/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-700/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="overflow-hidden flex gap-2 sm:gap-6 mb-8 px-4">
                    {mainText.split("").map((char, index) => (
                        <span
                            key={index}
                            ref={(el) => { letterRefs.current[index] = el; }}
                            className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter font-display text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 inline-block"
                        >
                            {char}
                        </span>
                    ))}
                </div>

                <p
                    ref={subTextRef}
                    className="text-base sm:text-lg md:text-xl text-gray-400 tracking-[0.4em] font-light uppercase mb-16"
                >
                    Agentic Portfolio
                </p>

                <div className="w-64 md:w-96 h-[2px] bg-gray-900 rounded-full overflow-hidden relative">
                    <div
                        ref={loaderRef}
                        className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    />
                </div>

                {/*<p
                    ref={hintRef}
                    className="mt-4 text-xs font-mono text-green-500/50 opacity-0 tracking-wider"
                >
                    System Initialized. Type 'help' for commands.
                </p>*/}
            </div>

            {/* Optional Overlay for different exit effect if needed, currently using opacity fade */}
            <div ref={overlayRef} className="absolute inset-0 bg-black z-[-1]" />
        </div>
    );
};

export default SplashScreen;
