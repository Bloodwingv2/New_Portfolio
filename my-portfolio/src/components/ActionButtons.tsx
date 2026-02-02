
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActionButtonsProps {
    prompts: string[];
    onSelect: (prompt: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ prompts, onSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            // Allow a small buffer (1px) for float calculation errors
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [prompts]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200; // Approximate width of a few buttons
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group w-full max-w-full">
            {/* Left Arrow */}
            <div
                className={`absolute left-0 top-0 bottom-2 z-10 flex items-center justify-center w-8 bg-black transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <button
                    onClick={() => scroll('left')}
                    className="p-1 hover:bg-gray-800 rounded-full text-gray-300 transition-colors"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={16} />
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-2 pb-2 px-2 scrollbar-hide snap-x snap-mandatory scroll-px-10"
            >
                {prompts.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(prompt)}
                        className="whitespace-nowrap px-4 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-full text-xs text-gray-300 transition-all hover:scale-105 active:scale-95 snap-start shrink-0"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Right Arrow */}
            <div
                className={`absolute right-0 top-0 bottom-2 z-10 flex items-center justify-center w-8 bg-black transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <button
                    onClick={() => scroll('right')}
                    className="p-1 hover:bg-gray-800 rounded-full text-gray-300 transition-colors"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;
