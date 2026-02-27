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
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="flex items-center gap-3 sm:gap-4 relative z-10 flex-1 min-w-[220px]">
                    {stats?.avatar_url ? (
                        <div className="relative shrink-0">
                            <img
                                src={stats.avatar_url}
                                alt={username}
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-gray-800"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-800">
                                <Github className="text-white w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                            <Github className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 truncate">
                            {username}
                            {isLoading && <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 animate-pulse shrink-0" />}
                        </h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">
                            {stats?.bio || "Software Engineer & AI Researcher"}
                        </p>
                    </div>
                </div>

                <a
                    href={stats?.html_url || `https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 relative z-10 w-full xs:w-auto shrink-0"
                >
                    View Profile
                </a>
            </div>

            {/* Metrics Bento Grid */}
            <div className="grid grid-cols-2 gap-px bg-gray-800/50">
                <div className="bg-gray-900 p-3 sm:p-4 md:p-5 flex items-center gap-2 sm:gap-3 md:gap-4 transition-colors group-hover:bg-gray-800/20">
                    <div className="p-1.5 sm:p-2 md:p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
                        <BookOpen className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
                    </div>
                    <div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-none">
                            {isLoading ? "..." : stats?.public_repos || 0}
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium mt-0.5 sm:mt-1">Public Repos</div>
                    </div>
                </div>

                <div className="bg-gray-900 p-3 sm:p-4 md:p-5 flex items-center gap-2 sm:gap-3 md:gap-4 transition-colors group-hover:bg-gray-800/20">
                    <div className="p-1.5 sm:p-2 md:p-2.5 bg-purple-500/10 rounded-lg text-purple-400">
                        <Users className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
                    </div>
                    <div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-none">
                            {isLoading ? "..." : stats?.followers || 0}
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium mt-0.5 sm:mt-1">Followers</div>
                    </div>
                </div>
            </div>

            {/* Contribution Graph Area */}
            <div className="p-4 sm:p-5 md:p-6 bg-black/50">
                <div className="flex items-center gap-2 mb-3">
                    <GitCommit className="text-green-400 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-300 uppercase tracking-wider">Live Contributions</span>
                </div>
                <div className="w-full overflow-hidden rounded-lg border border-gray-800/50 p-2 bg-gray-900/50">
                    {/* Dark mode filter applied via CSS to make the white background of the generic SVG transparent/dark */}
                    <img
                        src={chartUrl}
                        alt={`${username}'s Contribution Graph`}
                        className="w-full h-auto opacity-80 mix-blend-screen filter brightness-90 contrast-125 saturate-150"
                        style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
                    />
                </div>
            </div>

        </div>
    );
};

export default GithubWidget;
