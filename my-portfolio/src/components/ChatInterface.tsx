import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ChatMessage from './ChatMessage';
import ActionButtons from './ActionButtons';
import ProjectCard from './ProjectCard';
import SkillsDisplay from './SkillsDisplay';
import { portfolioData, suggestPrompts } from '../data/portfolioData';
import { Send, Terminal, Download, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
    id: string;
    role: 'agent' | 'user';
    content: React.ReactNode;
    isStreaming?: boolean;
};

interface ChatInterfaceProps {
    hasStarted: boolean;
    onStart: () => void;
    activePrompt: string | null;
    onPromptHandled: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ hasStarted, onStart, activePrompt, onPromptHandled }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Refs for animations
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Handle External Prompts (Sidebar)
    useEffect(() => {
        if (activePrompt) {
            handleSendMessage(activePrompt);
            onPromptHandled();
        }
    }, [activePrompt]);

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
        setMessages([initialGreeting]);
    }, []);

    // GSAP Transitions
    useGSAP(() => {
        if (hasStarted) {
            // Animate Hero OUT, Chat IN
            const tl = gsap.timeline();
            tl.to(heroRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                pointerEvents: 'none',
                display: 'none'
            })
                .to(chatRef.current, {
                    display: 'flex',
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    pointerEvents: 'all'
                }, "-=0.1");
        } else {
            // Animate Hero IN, Chat OUT
            const tl = gsap.timeline();
            tl.to(chatRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                display: 'none',
                pointerEvents: 'none'
            })
                .to(heroRef.current, {
                    display: 'flex',
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    pointerEvents: 'all'
                });
        }
    }, { scope: containerRef, dependencies: [hasStarted] });

    // Auto-scroll
    useEffect(() => {
        if (hasStarted) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, hasStarted]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        if (!hasStarted) {
            onStart();
        }

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        generateResponseStream(text);
    };

    const generateResponseStream = async (input: string) => {
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

        abortControllerRef.current = new AbortController();

        try {
            const systemPrompt = `You are an interactive AI portfolio assistant for Mirang Bhandari.
            
            CORE INSTRUCTIONS:
            1. Answer questions based on this data: ${JSON.stringify(portfolioData)}.
            2. Be professional but personable. Answer in the first person ("I started coding when...").
            3. CRITICAL: When relevant, use the following TAGS to display rich widgets. Do not describe the widget, just output the tag on a new line.
            
            TAGS:
            - If the user asks about projects/work: Output the text intro, then "{{PROJECTS}}" at the end.
            - If the user asks about skills/stack/technologies: Output the text intro, then "{{SKILLS}}" at the end.
            - If the user asks for a resume/CV: Output a polite message, then "{{RESUME}}".
            - If the user prompts "Surprise me" or asks for fun facts: Share a fun fact from the data.

            4. Keep responses concise. Use markdown for formatting.
            
            FORMATTING:
            - Use **bold** for key concepts, technologies, and project names.
            - Use \`code\` blocks for commands, shortcuts, or file names.
            - Use bullet points for lists of skills or steps.
            - Keep responses concise but conversational.`;

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
                            content: typeof m.content === 'string' ? m.content : "Displaying rich content."
                        })),
                        { role: "user", content: input }
                    ],
                    stream: true,
                    temperature: 0.7,
                    max_tokens: 1000
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) throw new Error(response.statusText);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const msgId = (Date.now() + 1).toString();
            let fullContent = "";

            setMessages(prev => [...prev, {
                id: msgId,
                role: 'agent',
                content: "",
                isStreaming: true
            }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            const content = data.choices[0]?.delta?.content || "";
                            fullContent += content;

                            setMessages(prev => prev.map(msg =>
                                msg.id === msgId
                                    ? { ...msg, content: renderContentWithTags(fullContent) }
                                    : msg
                            ));
                        } catch (e) {
                            console.error("Error parsing stream chunk", e);
                        }
                    }
                }
            }

            setMessages(prev => prev.map(msg =>
                msg.id === msgId ? { ...msg, isStreaming: false } : msg
            ));

        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error("Groq API Error:", error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'agent',
                content: `Error: ${error.message}. Please check your connection or API key.`
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    };

    const renderContentWithTags = (text: string) => {
        const parts = text.split(/({{PROJECTS}}|{{SKILLS}}|{{RESUME}})/g);
        return (
            <div className="whitespace-pre-wrap">
                {parts.map((part, index) => {
                    if (part === '{{PROJECTS}}') return (<div key={index} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">{portfolioData.projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>);
                    if (part === '{{SKILLS}}') return (<div key={index} className="mt-4 not-prose"><SkillsDisplay skills={portfolioData.skills} /></div>);
                    if (part === '{{RESUME}}') return (<div key={index} className="mt-4 not-prose"><a href={portfolioData.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"><Download size={20} />Download Resume</a></div>);
                    if (!part.trim()) return null;
                    return (
                        <div key={index} className="inline-block w-full">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                strong: ({ node, ...props }: any) => <span className="font-bold text-white bg-white/10 px-1 rounded" {...props} />,
                                ul: ({ node, ...props }: any) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
                                ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
                                li: ({ node, ...props }: any) => <li className="ml-2" {...props} />,
                                p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0 inline" {...props} />,
                                a: ({ node, ...props }: any) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                code: ({ node, ...props }: any) => <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-sm text-yellow-300" {...props} />,
                            }}>{part}</ReactMarkdown>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full relative overflow-hidden">
            {/* Hero Section */}
            <div
                ref={heroRef}
                className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center p-4 pb-32"
            >
                <div className="relative mb-6 md:mb-8 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img
                        src={portfolioData.profileImage}
                        alt={portfolioData.name}
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-gray-800 shadow-2xl relative z-10"
                    />
                    <div className="absolute bottom-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 border-4 border-black rounded-full z-20"></div>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 text-center tracking-tight">
                    Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{portfolioData.name}</span>
                </h2>
                <p className="text-gray-400 text-center max-w-lg text-base md:text-lg leading-relaxed px-4">
                    {portfolioData.role}. Ask me anything about my work, skills, or experience.
                </p>
            </div>

            {/* Messages Area - Initially Hidden via GSAP */}
            <div
                ref={chatRef}
                className="flex-1 flex flex-col overflow-hidden opacity-0 hidden"
            >
                <div className="flex-1 overflow-y-auto px-2 py-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                    ))}

                    {isTyping && !messages.some(m => m.isStreaming) && (
                        <div className="flex w-full mb-6 justify-start animate-pulse">
                            <div className="flex max-w-[85%] flex-row gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white text-black">
                                    <Terminal size={18} />
                                </div>
                                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-900 border border-gray-800 text-gray-400 text-sm flex items-center gap-2">
                                    <Sparkles size={14} className="text-yellow-500" />
                                    Thinking...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input Area - Always visible but styled to blend */}
            <div className="mt-auto pt-4 border-t border-gray-800 bg-black z-20 pb-2">
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
                        className="flex-1 bg-transparent text-white px-2 py-1 outline-none placeholder:text-gray-500 font-sans"
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
