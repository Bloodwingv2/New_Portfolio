import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ChatMessage from './ChatMessage';
import ActionButtons from './ActionButtons';
import MatrixEffect from './MatrixEffect';
import ThinkingVisualizer from './ThinkingVisualizer';
import Sidebar from './Sidebar';
import ProjectDetailModal from './ProjectDetailModal';
import ContactForm from './ContactForm';
import { portfolioData, suggestPrompts } from '../data/portfolioData';
import { Send, Terminal, Menu, ChevronLeft } from 'lucide-react';


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
    const [showMatrix, setShowMatrix] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Refs for animations
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    // Scroll handling
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollRef = useRef(true);

    const scrollToBottom = (instant = false) => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
        }
    };

    // Monitor scroll position
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
            shouldAutoScrollRef.current = isAtBottom;
        }
    };

    // Handle External Prompts (Sidebar)
    useEffect(() => {
        if (activePrompt) {
            handleSendMessage(activePrompt);
            onPromptHandled();
        }
    }, [activePrompt]);

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
                });
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

    // Auto-scroll on new messages (start of generation)
    useEffect(() => {
        if (hasStarted) {
            scrollToBottom();
            shouldAutoScrollRef.current = true;
        }
    }, [messages.length, hasStarted]);

    // Auto-scroll during streaming (only if already at bottom)
    useEffect(() => {
        if (isTyping && shouldAutoScrollRef.current) {
            scrollToBottom(true); // Instant scroll to prevent jitter
        }
    }, [messages, isTyping]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        if (!hasStarted) {
            onStart();
        }

        // Check for special commands
        if (processCommand(text)) {
            setInputValue("");
            return;
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

    const processCommand = (input: string): boolean => {
        const cmd = input.trim().toLowerCase();

        if (cmd === 'clear' || cmd === 'cls' || cmd === 'flush_log') {
            setMessages([]);
            return true;
        }

        if (cmd === 'matrix') {
            setShowMatrix(true);
            return true;
        }

        return false;
    };

    const getPredefinedResponse = (input: string): string | null => {
        const normalizedInput = input.trim().toLowerCase();

        // 1. Commands
        if (normalizedInput === 'help') {
            return `System Manual:\n\n- \`clear\`: Clear terminal\n- \`matrix\`: Enter the simulation`;
        }

        // 2. "Tell me about yourself"
        if (
            normalizedInput.includes("tell me about yourself") ||
            normalizedInput === "who are you?" ||
            normalizedInput === "who are you"
        ) {
            return portfolioData.bio;
        }

        // 3. "Show me your projects"
        if (
            normalizedInput.includes("show me your projects") ||
            normalizedInput.includes("list your projects") ||
            (normalizedInput.includes("projects") && normalizedInput.length < 20)
        ) {
            return "Here are some of the key projects I've worked on recently:\n\n{{PROJECTS}}";
        }

        // 4. "What are your skills?"
        if (
            normalizedInput.includes("what are your skills") ||
            normalizedInput.includes("technical skills") ||
            (normalizedInput.includes("skills") && normalizedInput.length < 20)
        ) {
            return "I have experience with a wide range of technologies in AI, Data Science, and Web Development. Here's my technical stack:\n\n{{SKILLS}}";
        }

        // 5. Work Experience
        if (
            normalizedInput.includes("experience") ||
            normalizedInput.includes("work") ||
            normalizedInput.includes("employment")
        ) {
            const expList = portfolioData.experience.map(exp =>
                `**${exp.role}** at ${exp.company} (${exp.period})\n${exp.description}`
            ).join('\n\n');
            return `Here is my professional experience:\n\n${expList}`;
        }

        // 6. Certifications
        if (
            normalizedInput.includes("certification") ||
            normalizedInput.includes("certificate")
        ) {
            const certList = portfolioData.certifications.map(cert =>
                `- **${cert.name}** (${cert.issuer}, ${cert.date})`
            ).join('\n');
            return `I have the following certifications:\n\n${certList}`;
        }

        // 7. Hobbies & Interests
        if (
            normalizedInput.includes("hobbies") ||
            normalizedInput.includes("hobby") ||
            normalizedInput.includes("interest")
        ) {
            const hobbies = portfolioData.hobbies.join(', ');
            const interests = portfolioData.interests.map(i => `**${i.title}**: ${i.description}`).join('\n- ');
            return `**Hobbies**: ${hobbies}\n\n**Interests**:\n- ${interests}`;
        }

        // 8. Contact / Socials
        if (
            normalizedInput.includes("contact") ||
            normalizedInput.includes("social") ||
            normalizedInput.includes("email") ||
            normalizedInput.includes("reach out")
        ) {
            // Check if it's specifically a request for the form
            if (normalizedInput.includes("form") || normalizedInput.includes("message") || normalizedInput.includes("send") || normalizedInput.includes("contact")) {
                // We return a special marker string that we'll catch in generateResponseStream or handle immediately?
                // Actually, getPredefinedResponse returning a string is strictly for text responses.
                // If I want to return a component, I need to change the logic control flow.
                return "{{CONTACT_FORM}}";
            }
            const socials = portfolioData.socials.map(s => `[${s.name}](${s.url})`).join(' • ');
            return `You can reach me via:\n\n${socials}`;
        }

        // 9. "Do you have a resume?"
        if (
            normalizedInput.includes("resume") ||
            normalizedInput.includes("cv") ||
            normalizedInput.includes("download resume")
        ) {
            return "Yes! You can view and download my full resume using the button below.\n\n{{RESUME}}";
        }

        // 10. "Surprise me!"
        if (
            normalizedInput.includes("surprise me") ||
            normalizedInput.includes("fun fact")
        ) {
            const randomFact = portfolioData.funFacts[Math.floor(Math.random() * portfolioData.funFacts.length)];
            return `Here's a fun fact about me: ${randomFact}`;
        }

        return null;
    };

    const streamLocalResponse = async (responseText: string) => {
        const msgId = (Date.now() + 1).toString();

        setMessages(prev => [...prev, {
            id: msgId,
            role: 'agent',
            content: "",
            isStreaming: true
        }]);

        setIsTyping(true);
        abortControllerRef.current = new AbortController();

        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 600));

        let currentText = "";
        const chunkSize = 4; // Characters per tick

        for (let i = 0; i < responseText.length; i += chunkSize) {
            if (abortControllerRef.current?.signal.aborted) break;

            const chunk = responseText.slice(i, i + chunkSize);
            currentText += chunk;

            setMessages(prev => prev.map(msg =>
                msg.id === msgId
                    ? { ...msg, content: currentText }
                    : msg
            ));

            // Random typing delay
            await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
        }

        setMessages(prev => prev.map(msg =>
            msg.id === msgId ? { ...msg, isStreaming: false } : msg
        ));

        setIsTyping(false);
        abortControllerRef.current = null;
    };

    const generateResponseStream = async (input: string) => {
        // 1. Check for local predefined response
        const localResponse = getPredefinedResponse(input);
        if (localResponse) {
            if (localResponse === "{{CONTACT_FORM}}") {
                setIsTyping(true);
                // Simulate "initializing secure channel"
                await new Promise(resolve => setTimeout(resolve, 1500));

                const msgId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, {
                    id: msgId,
                    role: 'agent',
                    content: <ContactForm />
                }]);
                setIsTyping(false);
                return;
            }
            await streamLocalResponse(localResponse);
            return;
        }

        // 2. Fallback to LLM API
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

        // Artificial delay for "processing" feel
        await new Promise(resolve => setTimeout(resolve, 1200));

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

            if (!response.ok) {
                const errorText = await response.text().catch(() => response.statusText);
                throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
            }
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

            let lastUpdateTime = 0;
            const THROTTLE_MS = 50;

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

                            const now = Date.now();
                            if (now - lastUpdateTime > THROTTLE_MS) {
                                setMessages(prev => prev.map(msg =>
                                    msg.id === msgId
                                        ? { ...msg, content: fullContent }
                                        : msg
                                ));
                                lastUpdateTime = now;
                            }
                        } catch (e) {
                            console.error("Error parsing stream chunk", e);
                        }
                    }
                }
            }

            // Ensure final content is set
            setMessages(prev => prev.map(msg =>
                msg.id === msgId
                    ? { ...msg, content: fullContent, isStreaming: false }
                    : msg
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

    return (
        <div ref={containerRef} className="flex flex-col h-full relative overflow-hidden">
            {/* Hero Section */}
            <div
                ref={heroRef}
                className="flex-1 w-full bg-black flex flex-col items-center justify-center p-4 overflow-y-auto"
            >
                <div className="relative mb-6 md:mb-8 group">
                    {/* Background Glow - Removed for cleaner look */}
                    <img
                        src={portfolioData.profileImage}
                        alt={portfolioData.name}
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-gray-900 shadow-2xl relative z-10"
                    />
                    <div className="absolute bottom-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-blue-500 border-4 border-black rounded-full z-20"></div>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 text-center tracking-tight">
                    Hi, I'm {portfolioData.name}
                </h2>
                <p className="text-gray-400 text-center max-w-lg text-base md:text-md leading-relaxed px-4 mb-8">
                    {portfolioData.role}. Ask me anything about my work, skills, or experience.
                </p>

                <button
                    onClick={onStart}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-all hover:scale-105 active:scale-95 text-sm font-medium backdrop-blur-md group"
                >
                    <span className="relative">
                        <span className="absolute -inset-1 rounded-full bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></span>
                        Start Chatting
                    </span>
                    <Send size={16} className="text-green-400 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Messages Area - Initially Hidden via GSAP */}
            <div
                ref={chatRef}
                className="flex-1 flex flex-col overflow-hidden opacity-0 hidden"
            >
                <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-2 py-4"
                >
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            role={msg.role}
                            content={msg.content}
                            onProjectSelect={setSelectedProject}
                        />
                    ))}

                    {isTyping && !messages.some(m => m.isStreaming) && (
                        <div className="flex w-full mb-6 justify-start animate-pulse">
                            <div className="flex max-w-[85%] flex-row gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white text-black">
                                    <Terminal size={18} />
                                </div>
                                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-900 border border-gray-800 text-gray-400 text-sm flex items-center gap-2">
                                    <ThinkingVisualizer />
                                    <span className="text-xs text-gray-500 font-mono self-center ml-2">Process(pid=404)</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectDetailModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}

            {/* Matrix Effect Overlay */}
            {showMatrix && <MatrixEffect onExit={() => setShowMatrix(false)} />}

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onClear={() => setMessages([])}
                onCommandSelect={handleSendMessage}
            />

            {/* Toggle Sidebar Button - Animate with Sidebar */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed top-1/2 -translate-y-1/2 z-[60] p-3 text-gray-400 hover:text-white bg-[#171717] border border-[#2f2f2f] transition-all duration-300 ease-out shadow-xl ${isSidebarOpen
                    ? 'left-80 rounded-r-xl border-l-[#171717]'
                    : 'left-0 rounded-r-xl border-l-0'
                    }`}
                aria-label="Toggle Menu"
            >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>

            {/* Input Area - Always visible but styled to blend */}
            <div className="pt-2 border-t border-gray-800 bg-black z-20 pb-2">
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
