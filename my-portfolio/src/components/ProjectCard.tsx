
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

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
    const imageRef = useRef<HTMLImageElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const card = cardRef.current;
        if (!card) return;

        const hoverTl = gsap.timeline({ paused: true });

        hoverTl.to(imageRef.current, {
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out"
        }, 0)
            .to(arrowRef.current, {
                x: 4,
                y: -4,
                opacity: 1,
                duration: 0.3,
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
            className="block w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors group cursor-pointer"
        >
            <div className="relative h-48 overflow-hidden bg-gray-800">
                {project.image ? (
                    <img
                        ref={imageRef}
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <ExternalLink size={48} strokeWidth={1} />
                    </div>
                )}
            </div>

            <div className="p-4 relative">
                <div ref={arrowRef} className="absolute top-4 right-4 text-white opacity-0 transition-opacity">
                    <ArrowUpRight size={20} />
                </div>

                <div className="text-xs font-mono text-green-400 mb-2">{project.category}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{project.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
            </div>
        </a>
    );
};

export default ProjectCard;
