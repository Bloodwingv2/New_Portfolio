import React from 'react';
import { ArrowUpRight } from 'lucide-react';


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
    onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, onClick }) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
    };
    return (
        <div
            className="perspective-1000 h-full w-full shrink-0 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <div
                ref={cardRef}
                className="group relative h-full w-full rounded-xl transition-all duration-200 ease-out"
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Main Content Container - Image Background */}
                <div className="absolute inset-0 bg-gray-900 rounded-xl overflow-hidden border border-gray-800">

                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${project.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col items-start translate-z-20">
                        <span className="px-2 py-1 mb-2 text-[10px] font-bold tracking-wider text-blue-400 bg-blue-900/30 border border-blue-500/30 rounded uppercase backdrop-blur-md">
                            {project.category}
                        </span>
                        <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-blue-300 transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                            {project.description}
                        </p>
                    </div>

                    {/* Top Right Arrow */}
                    <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-white/70 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
                        <ArrowUpRight size={16} />
                    </div>
                </div>

                {/* Holographic Border Glow */}
                <div
                    className={`absolute -inset-[1px] bg-gradient-to-tr from-blue-500/0 via-blue-500/40 to-purple-500/0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : ''}`}
                    style={{ transform: 'translateZ(-1px)' }}
                />
            </div>
        </div>
    );
});

export default ProjectCard;
