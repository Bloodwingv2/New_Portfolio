
import React from 'react';

interface ActionButtonsProps {
    prompts: string[];
    onSelect: (prompt: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ prompts, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(prompt)}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-full text-sm text-gray-300 transition-all hover:scale-105 active:scale-95 text-left"
                >
                    {prompt}
                </button>
            ))}
        </div>
    );
};

export default ActionButtons;
