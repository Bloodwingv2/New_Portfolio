import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [text, setText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLParagraphElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const fullText = "MGPT";

    useEffect(() => {
        const tl = gsap.timeline();

        // Initial state
        gsap.set(subTextRef.current, { opacity: 0, y: 10 });

        // Typing Logic
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex <= fullText.length) {
                setText(fullText.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typeInterval);

                // Sequence after typing finishes
                tl.to(subTextRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.2
                })
                    .to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        delay: 1,
                        onComplete: onComplete
                    });
            }
        }, 150); // Typing speed per character

        return () => clearInterval(typeInterval);
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white isolate overflow-hidden font-sans"
        >
            {/* Background Gradients - Removed for cleaner look */}

            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Logo */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20" /> {/* Reduced opacity, removed pulse */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white relative z-10"
                        >
                            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
                            <path d="m4.93 10.93 1.41 1.41a2 2 0 1 1-2.83 2.83l-1.41-1.41a2 2 0 1 1 2.83-2.83Z" />
                            <path d="m19.07 10.93-1.41 1.41a2 2 0 1 0 2.83 2.83l1.41-1.41a2 2 0 1 0-2.83-2.83Z" />
                            <path d="M12 22a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z" />
                            <path d="m4.93 4.93 1.41 1.41a2 2 0 1 0 2.83-2.83L7.76 2.1a2 2 0 1 0-2.83 2.83Z" />
                            <path d="m19.07 4.93-1.41 1.41a2 2 0 1 1-2.83-2.83l1.41-1.41a2 2 0 1 1 2.83 2.83Z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-white">
                        {text}
                    </h1>
                    {/* Blinking Cursor */}
                    <div
                        ref={cursorRef}
                        className="w-3 h-10 sm:w-5 sm:h-16 md:w-6 md:h-20 bg-blue-500/80 ml-1 sm:ml-2 animate-pulse rounded-full"
                    />
                </div>

                <p
                    ref={subTextRef}
                    className="text-base sm:text-lg md:text-xl text-gray-500 tracking-[0.4em] font-mono uppercase mt-8"
                >
                    Agentic Portfolio
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
