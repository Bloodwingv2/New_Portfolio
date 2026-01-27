import React from 'react';
import { ArrowUpRight, FolderOpen } from 'lucide-react';


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

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project }) => {
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
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
                <div className="text-gray-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
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
});

export default ProjectCard;
