import React from 'react';

interface SkillsDisplayProps {
    skills: string[];
}

const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <span
                    key={skill}
                    className="px-3 py-1 bg-gray-900 text-gray-300 text-sm rounded-full border border-gray-800 hover:border-green-500 hover:text-green-400 transition-colors cursor-default"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
};

export default SkillsDisplay;
