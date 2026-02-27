/**
 * githubAgent.ts
 * 
 * ============================================================================
 * 🤖 AGENTIC PORTFOLIO TOOL: GITHUB ACTIVITY FETCHER
 * ============================================================================
 * 
 * This file defines the tools that the LLM can decide to use if the user 
 * asks about your recent coding activity. By keeping this separate, the 
 * core ChatInterface component stays clean, and the Agent tools are clearly 
 * defined here.
 */

// 1. Tool Definition (sent to the LLM so it knows this tool exists)
export const githubActivityToolDefinition = {
    type: "function",
    function: {
        name: "fetch_github_activity",
        description: "Fetches Mirang's most recent GitHub commit activity and repository updates. Call this when the user asks what Mirang is currently working on, coding, building, or his recent GitHub activity.",
        parameters: {
            type: "object",
            properties: {
                username: {
                    type: "string",
                    description: "The GitHub username to fetch. Should always be 'Bloodwingv2'."
                }
            },
            required: ["username"]
        }
    }
};

interface CacheType {
    timestamp: number;
    data: string | null;
}

let githubCache: CacheType = {
    timestamp: 0,
    data: null
};

// 2. Tool Execution (the actual API call executed when the LLM requests it)
export const fetchGithubActivity = async (username: string = 'Bloodwingv2'): Promise<string> => {
    // Check if we have a valid cache (less than 5 minutes old)
    const CACHE_TTL = 5 * 60 * 1000;
    if (githubCache.data && (Date.now() - githubCache.timestamp < CACHE_TTL)) {
        console.log("Serving GitHub activity from cache");
        return githubCache.data;
    }

    try {
        const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
        const headers: Record<string, string> = {};
        if (githubToken) {
            headers['Authorization'] = `Bearer ${githubToken}`;
        }

        // We no longer need the User API call for stats, as the Widget handles that UI independently
        // 2. Fetch public events for recent activity
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=40`, {
            headers
        });

        if (!eventsResponse.ok) throw new Error(`GitHub API (Events) returned status: ${eventsResponse.status}`);
        const events = await eventsResponse.json();

        // 3. Filter and parse relevant activity
        const relevantEvents = events.filter((event: any) => {
            if (event.type === 'CreateEvent' || event.type === 'PullRequestEvent' || event.type === 'PushEvent') return true;
            return false;
        });

        // Group relevant events by repository for a structured JSON payload
        const repoActivity: Record<string, { pushCount: number, prCount: number, repoCreated: boolean, recentCommits: string[] }> = {};

        relevantEvents.slice(0, 30).forEach((event: any) => {
            const repoName = event.repo.name;
            if (!repoActivity[repoName]) {
                repoActivity[repoName] = { pushCount: 0, prCount: 0, repoCreated: false, recentCommits: [] };
            }

            if (event.type === 'PushEvent') {
                repoActivity[repoName].pushCount += 1;
                const commits = event.payload?.commits || [];
                commits.forEach((commit: any) => {
                    if (repoActivity[repoName].recentCommits.length < 3) {
                        // Strip out newlines for cleaner JSON
                        repoActivity[repoName].recentCommits.push(commit.message.split('\n')[0]);
                    }
                });
            } else if (event.type === 'PullRequestEvent') {
                repoActivity[repoName].prCount += 1;
            } else if (event.type === 'CreateEvent' && event.payload?.ref_type === 'repository') {
                repoActivity[repoName].repoCreated = true;
            }
        });

        // Format into a strict, unambiguous JSON structure for the LLM
        const structuredData = Object.entries(repoActivity).map(([repo, data]) => {
            const actions = [];
            if (data.repoCreated) actions.push("Created repository");
            if (data.pushCount > 0) actions.push(`Pushed ${data.pushCount} time(s)`);
            if (data.prCount > 0) actions.push(`Opened ${data.prCount} PR(s)`);

            return {
                repository: repo,
                activity: actions,
                recent_commits: data.recentCommits
            };
        });

        // Return a highly condensed JSON string for the LLM to read and summarize
        // We stripped out the statistics node to save tokens since the UI widget displays that directly
        const payload = JSON.stringify({
            recent_github_activity: structuredData.length > 0 ? structuredData : "No recent public coding activity found. DO NOT MENTION REPOSITORIES OR PROJECTS FROM BACKGROUND KNOWLEDGE."
        });

        // Update Cache
        githubCache = {
            timestamp: Date.now(),
            data: payload
        };

        return payload;

    } catch (error: any) {
        console.error("Failed to fetch GitHub activity for Agent:", error);
        return JSON.stringify({
            status: "error",
            message: `Failed to fetch GitHub activity: ${error.message}`
        });
    }
};
