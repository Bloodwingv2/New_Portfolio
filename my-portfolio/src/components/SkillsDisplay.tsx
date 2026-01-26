import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Code, Cpu, Globe, Wrench } from 'lucide-react';

export interface SkillCategory {
    title: string;
    icon: string;
    skills: string[];
}

interface SkillsDisplayProps {
    skills: SkillCategory[];
}

const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".skill-section", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        });
    }, { scope: containerRef });

    const getIcon = (name: string) => {
        switch (name) {
            case 'code': return <Code size={20} />;
            case 'cpu': return <Cpu size={20} />;
            case 'globe': return <Globe size={20} />;
            case 'tool': return <Wrench size={20} />;
            default: return <Code size={20} />;
        }
    };

    return (
        <div ref={containerRef} className="flex flex-col gap-8 w-full">
            {skills.map((category, idx) => (
                <div key={idx} className="skill-section">
                    <div className="flex items-center gap-3 mb-4 text-gray-200">
                        <span className="p-2 bg-gray-800 rounded-lg text-purple-400">
                            {getIcon(category.icon)}
                        </span>
                        <h4 className="font-bold text-lg tracking-wide">{category.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-2">
                        {category.skills.map((skill, sIdx) => (
                            <span
                                key={sIdx}
                                className="px-4 py-1.5 bg-black border border-gray-800 rounded-full text-sm font-medium text-gray-300 hover:border-purple-500 hover:text-white hover:bg-gray-900 transition-all cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkillsDisplay;
