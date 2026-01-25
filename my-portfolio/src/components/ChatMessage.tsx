
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    role: 'agent' | 'user';
    content: React.ReactNode;
    timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(containerRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={`flex w-full mb-6 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${role === 'agent' ? 'bg-white text-black' : 'bg-gray-800 text-gray-300'
                    }`}>
                    {role === 'agent' ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 ${role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed ${role === 'agent'
                            ? 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm'
                            : 'bg-white text-black rounded-tr-sm'
                        }`}>
                        {content}
                    </div>
                    {/* Timestamp placeholder if needed */}
                    {/* <span className="text-[10px] text-gray-600">10:43 AM</span> */}
                </div>

            </div>
        </div>
    );
};

export default ChatMessage;
