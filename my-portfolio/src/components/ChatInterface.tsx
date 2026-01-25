
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ActionButtons from './ActionButtons';
import ProjectCard from './ProjectCard';
import SkillsDisplay from './SkillsDisplay';
import { portfolioData, suggestPrompts } from '../data/portfolioData';
import { Send, Terminal } from 'lucide-react';

type Message = {
    id: string;
    role: 'agent' | 'user';
    content: React.ReactNode;
};

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        const initialGreeting: Message = {
            id: "init-1",
            role: 'agent',
            content: (
                <div>
                    <p className="mb-2">Hello! I'm an AI agent representing <strong>{portfolioData.name}</strong>.</p>
                    <p>I can help you explore Mirang's work, skills, and background. What would you like to know?</p>
                </div>
            )
        };

        // Simulate initial delay
        const timer = setTimeout(() => {
            setMessages([initialGreeting]);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate Agent processing
        setTimeout(() => {
            const response = generateResponse(text);
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1000 + Math.random() * 500); // Random delay between 1s and 1.5s
    };

    const generateResponse = (input: string): Message => {
        const lowerInput = input.toLowerCase();
        let content: React.ReactNode = "I'm not sure how to answer that specifically, but you can explore the projects or ask about my background.";

        if (lowerInput.includes("about") || lowerInput.includes("bio") || lowerInput.includes("who are you")) {
            content = (
                <div className="whitespace-pre-line">
                    <p className="font-semibold text-white mb-2">{portfolioData.role}</p>
                    {portfolioData.bio}
                </div>
            );
        } else if (lowerInput.includes("project") || lowerInput.includes("work")) {
            content = (
                <div className="space-y-4">
                    <p>Here are some of the key projects:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolioData.projects.map(p => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                </div>
            );
        } else if (lowerInput.includes("skill") || lowerInput.includes("stack") || lowerInput.includes("tech")) {
            content = (
                <div>
                    <p className="mb-3">My technical expertise includes:</p>
                    <SkillsDisplay />
                </div>
            );
        } else if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("reach")) {
            content = (
                <div>
                    <p className="mb-2">You can reach me via:</p>
                    <ul className="space-y-1">
                        {portfolioData.socials.map(s => (
                            <li key={s.name}>
                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                                    {s.name}: {s.handle}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        return {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content
        };
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}

                {isTyping && (
                    <div className="flex w-full mb-6 justify-start animate-pulse">
                        <div className="flex max-w-[85%] flex-row gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white text-black">
                                <Terminal size={18} />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-900 border border-gray-800 text-gray-400 text-sm flex items-center">
                                Processing query...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="mt-auto pt-4 border-t border-gray-800 bg-black z-10 pb-2">
                <ActionButtons prompts={suggestPrompts} onSelect={handleSendMessage} />

                <form
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                    className="flex gap-2 mt-4 relative items-center bg-gray-900 p-2 rounded-xl border border-gray-800 focus-within:border-gray-600 transition-colors"
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask something..."
                        className="flex-1 bg-transparent text-white px-2 py-1 outline-none placeholder:text-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="p-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
