import React from 'react';
import { X, Trash2, Terminal, ChevronRight } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onClear: () => void;
    onCommandSelect: (cmd: string) => void;
}

const secretCommands = [
    { cmd: 'help', desc: 'System manual' },
    { cmd: 'clear', desc: 'Clear terminal' },
    { cmd: 'matrix', desc: 'Enter simulation' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onClear, onCommandSelect }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-[#171717] border-r border-[#171717] z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                            <Terminal size={20} className="text-white" />
                            <span>System Control</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[#212121] rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-2">Secret Commands</h3>
                        <div className="space-y-1">
                            {secretCommands.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onCommandSelect(item.cmd);
                                        onClose();
                                    }}
                                    className="w-full text-left group p-2 rounded-lg hover:bg-[#212121] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center rounded bg-[#212121] group-hover:bg-[#2f2f2f] text-gray-200 transition-colors">
                                            <ChevronRight size={14} />
                                        </div>
                                        <div>
                                            <code className="text-sm font-medium text-gray-200 block">{item.cmd}</code>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="pt-6 border-t border-gray-800 mt-auto">
                        <button
                            onClick={() => {
                                onClear();
                                onClose();
                            }}
                            className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40"
                        >
                            <Trash2 size={18} />
                            <span className="font-medium">Clear Chat History</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
