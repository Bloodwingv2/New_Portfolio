import React, { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Bot, User, Download } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import ProjectCard from './ProjectCard';
import SkillsDisplay from './SkillsDisplay';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
    role: 'agent' | 'user';
    content: string | React.ReactNode;
    timestamp?: string;
}

const RichMessageContent: React.FC<{ content: string }> = ({ content }) => {
    // Memoize the expensive parsing logic
    const parts = useMemo(() => {
        if (!content) return [];
        return content.split(/({{PROJECTS}}|{{SKILLS}}|{{RESUME}})/g);
    }, [content]);

    return (
        <div className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part === '{{PROJECTS}}') {
                    return (
                        <div key={index} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                            {portfolioData.projects.map(p => (
                                <ProjectCard key={p.id} project={p} />
                            ))}
                        </div>
                    );
                }
                if (part === '{{SKILLS}}') {
                    return (
                        <div key={index} className="mt-4 not-prose">
                            <SkillsDisplay skills={portfolioData.skills} />
                        </div>
                    );
                }
                if (part === '{{RESUME}}') {
                    return (
                        <div key={index} className="mt-4 not-prose">
                            <a
                                href={portfolioData.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Download size={20} />
                                Download Resume
                            </a>
                        </div>
                    );
                }
                if (!part.trim()) return null;

                return (
                    <div key={index} className="inline-block w-full">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                strong: ({ node, ...props }: any) => <span className="font-bold text-white bg-white/10 px-1 rounded" {...props} />,
                                ul: ({ node, ...props }: any) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
                                ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
                                li: ({ node, ...props }: any) => <li className="ml-2" {...props} />,
                                p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0 inline" {...props} />,
                                a: ({ node, ...props }: any) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                code: ({ node, ...props }: any) => <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-sm text-yellow-300" {...props} />,
                            }}
                        >
                            {part}
                        </ReactMarkdown>
                    </div>
                );
            })}
        </div>
    );
};

// Use React.memo for the entire message component to prevent re-renders of old messages during streaming
const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ role, content }) => {
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
                        {/* If content is string and agent, use Rich renderer. Else just render node/string */}
                        {role === 'agent' && typeof content === 'string' ? (
                            <RichMessageContent content={content} />
                        ) : (
                            content
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
});

export default ChatMessage;
