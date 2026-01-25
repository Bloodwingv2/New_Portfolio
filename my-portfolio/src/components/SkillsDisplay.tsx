
import React from 'react';

const skills = [
    "React", "TypeScript", "Node.js", "Python",
    "Machine Learning", "Data Science", "AWS", "Docker",
    "PostgreSQL", "TailwindCSS", "Next.js", "GraphQL",
    "TensorFlow", "PyTorch", "MLOps"
];

const SkillsDisplay: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <span
                    key={skill}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700 hover:border-green-500 hover:text-green-400 transition-colors cursor-default"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
};

export default SkillsDisplay;
