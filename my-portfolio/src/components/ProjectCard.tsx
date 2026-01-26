import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ExternalLink, ArrowUpRight, FolderOpen } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    link: string;
    image?: string;
}

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const card = cardRef.current;
        if (!card) return;

        const hoverTl = gsap.timeline({ paused: true });

        hoverTl.to(arrowRef.current, {
            x: 2,
            y: -2,
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
        }, 0);

        const onEnter = () => hoverTl.play();
        const onLeave = () => hoverTl.reverse();

        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);

        return () => {
            card.removeEventListener('mouseenter', onEnter);
            card.removeEventListener('mouseleave', onLeave);
        };
    }, { scope: cardRef });

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            ref={cardRef}
            className="group flex flex-col bg-black border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors h-full"
        >
            {/* Minimal Header */}
            <div className="p-4 flex items-start justify-between border-b border-gray-900 bg-gray-900/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-900 text-blue-400 rounded-lg">
                        <FolderOpen size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-gray-100 group-hover:text-white transition-colors">
                            {project.title}
                        </h3>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                            {project.category}
                        </span>
                    </div>
                </div>
                <div ref={arrowRef} className="text-gray-500 opacity-50 transition-opacity">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            {/* Description Body */}
            <div className="p-5 flex-1 bg-gradient-to-br from-black to-gray-950/50">
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                    {project.description}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-900 flex items-center gap-2">
                    <span className="text-xs text-blue-500 font-medium group-hover:underline flex items-center gap-1">
                        View Project
                    </span>
                </div>
            </div>
        </a>
    );
};

export default ProjectCard;
