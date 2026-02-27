import React, { useEffect, useState } from 'react';
import { Github, Users, BookOpen, GitCommit, Activity } from 'lucide-react';

interface GithubStats {
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
    html_url: string;
    bio: string;
}

const GithubWidget: React.FC = () => {
    const [stats, setStats] = useState<GithubStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const username = 'Bloodwingv2';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
                const headers: Record<string, string> = {};
                if (githubToken) {
                    headers['Authorization'] = `Bearer ${githubToken}`;
                }

                const response = await fetch(`https://api.github.com/users/${username}`, { headers });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to load GitHub stats for widget:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // The ghchart service generates a live SVG block of the user's contribution heatmap
    const chartUrl = `https://ghchart.rshah.org/22c55e/${username}`;

    return (
        <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl mt-4 animate-fade-in-up transition-all hover:border-gray-700 group">

            {/* Header Section */}
            <div className="p-5 flex items-start justify-between border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="flex items-center gap-4 relative z-10">
                    {stats?.avatar_url ? (
                        <div className="relative">
                            <img
                                src={stats.avatar_url}
                                alt={username}
                                className="w-14 h-14 rounded-full border-2 border-gray-800"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-800">
                                <Github size={12} className="text-white" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                            <Github size={24} className="text-gray-400" />
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {username}
                            {isLoading && <Activity size={14} className="text-green-500 animate-pulse" />}
                        </h3>
                        <p className="text-xs text-gray-400 max-w-[200px] truncate">
                            {stats?.bio || "Software Engineer & AI Researcher"}
                        </p>
                    </div>
                </div>

                <a
                    href={stats?.html_url || `https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 relative z-10"
                >
                    View Profile
                </a>
            </div>

            {/* Metrics Bento Grid */}
            <div className="grid grid-cols-2 gap-px bg-gray-800/50">
                <div className="bg-gray-900 p-4 flex items-center gap-3 transition-colors group-hover:bg-gray-800/20">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white leading-none">
                            {isLoading ? "..." : stats?.public_repos || 0}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">Public Repos</div>
                    </div>
                </div>

                <div className="bg-gray-900 p-4 flex items-center gap-3 transition-colors group-hover:bg-gray-800/20">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Users size={18} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white leading-none">
                            {isLoading ? "..." : stats?.followers || 0}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">Followers</div>
                    </div>
                </div>
            </div>

            {/* Contribution Graph Area */}
            <div className="p-5 bg-black/50">
                <div className="flex items-center gap-2 mb-3">
                    <GitCommit size={14} className="text-green-400" />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Live Contributions</span>
                </div>
                <div className="w-full overflow-x-auto rounded-lg border border-gray-800/50 p-2 bg-gray-900/50 custom-scrollbar">
                    {/* Dark mode filter applied via CSS to make the white background of the generic SVG transparent/dark */}
                    <img
                        src={chartUrl}
                        alt={`${username}'s Contribution Graph`}
                        className="min-w-[700px] h-auto opacity-80 mix-blend-screen filter brightness-90 contrast-125 saturate-150"
                        style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
                    />
                </div>
            </div>

        </div>
    );
};

export default GithubWidget;
