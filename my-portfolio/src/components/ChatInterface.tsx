
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ActionButtons from './ActionButtons';
// import ProjectCard from './ProjectCard';
// import SkillsDisplay from './SkillsDisplay';
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

        // Call Groq API
        generateResponse(text);
    };

    const generateResponse = async (input: string) => {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;

        if (!apiKey) {
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'agent',
                content: "I'm missing my brain! Please set the VITE_GROQ_API_KEY in the .env file."
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsTyping(false);
            return;
        }

        try {
            const systemPrompt = `You are an AI assistant for a portfolio website representing Mirang. 
            Here is the portfolio data: ${JSON.stringify(portfolioData)}. 
            Your goal is to answer questions about Mirang's skills, projects, and background based on this data.
            Be helpful, professional, and concise. If you don't know something, admit it but try to connect it to available info.
            Always answer in the first person as if you are the agent representing Mirang.`;

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages.map(m => ({
                            role: m.role === 'agent' ? 'assistant' : 'user',
                            content: typeof m.content === 'string' ? m.content : "Displaying rich content component."
                        })),
                        { role: "user", content: input }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const aiContent = data.choices[0].message.content;

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: <div className="whitespace-pre-wrap">{aiContent}</div>
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error: any) {
            console.error("Groq API Error:", error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'agent',
                content: `Error: ${error.message || "Unknown error occurred"}. Check console for details.`
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
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
