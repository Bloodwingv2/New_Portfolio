import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X, ExternalLink, Github, Layers } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    link: string;
    image?: string;
}

interface ProjectDetailModalProps {
    project: Project;
    onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isScanning, setIsScanning] = React.useState(true);

    useGSAP(() => {
        // Backdrop fade in
        gsap.fromTo(backdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );

        // Modal scale up and fade in
        gsap.fromTo(modalRef.current,
            { scale: 0.9, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
        );
    }, []);

    // Scanning Timer
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsScanning(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Animate content in after scanning
    useGSAP(() => {
        if (!isScanning) {
            gsap.from(contentRef.current?.children || [], {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }, { dependencies: [isScanning] });

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) {
            handleClose();
        }
    };

    const handleClose = () => {
        // Animate out
        gsap.to(modalRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: onClose
        });
        gsap.to(backdropRef.current, {
            opacity: 0,
            duration: 0.2
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ perspective: '1000px' }}
        >
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleBackdropClick}
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] min-h-[400px]"
            >
                {isScanning ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping" />
                            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-blue-400 font-mono font-bold text-lg animate-pulse">ACCESSING ARCHIVES</h3>
                            <div className="text-gray-500 text-xs font-mono mt-2 space-y-1">
                                <p>Decrypting project data...</p>
                                <p>Verifying assets...</p>
                                <p>Establishing link: {project.id.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header Image Area */}
                        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden group">
                            {/* Placeholder for actual image or creative pattern */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${project.image || 'https://grainy-gradients.vercel.app/noise.svg'})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

                            {/* Abstract tech overlay */}
                            <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                                <Layers className="text-purple-500" size={20} />
                            </div>

                            <button
                                onClick={handleClose}
                                className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono uppercase tracking-wider mb-3 inline-block">
                                    {project.category}
                                </span>
                                <h2 className="text-3xl font-bold text-white tracking-tight">{project.title}</h2>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div ref={contentRef} className="p-6 sm:p-8 flex-1 overflow-y-auto">

                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-gray-200 font-semibold mb-2">About Project</h3>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    {project.description}
                                </p>

                                {/* Simulated Tags - In a real app these would be prop data */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {['React', 'TypeScript', 'Tailwind', 'GSAP'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-md text-xs text-gray-400 font-mono">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="flex gap-4 pt-6 border-t border-gray-800">
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/20"
                                >
                                    <ExternalLink size={18} />
                                    Visit Live Site
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="flex items-center justify-center p-3 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 rounded-lg transition-colors"
                                >
                                    <Github size={20} />
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailModal;
