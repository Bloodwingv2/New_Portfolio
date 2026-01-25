
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col h-screen w-full max-w-4xl mx-auto p-4 md:p-6 font-sans">
            <header className="flex justify-between items-center py-4 border-b border-gray-800 mb-4">
                <h1 className="text-xl font-semibold tracking-tight"><span className="text-gray-500">Agentic Portfolio</span></h1>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Online</span>
                </div>
            </header>
            <main className="flex-1 overflow-hidden flex flex-col relative">
                {children}
            </main>
        </div>
    );
};

export default Layout;
