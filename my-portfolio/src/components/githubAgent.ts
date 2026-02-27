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

// 2. Tool Execution (the actual API call executed when the LLM requests it)
export const fetchGithubActivity = async (username: string = 'Bloodwingv2'): Promise<string> => {
    try {
        // 1. Fetch user profile stats
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error(`GitHub API (User) returned status: ${userResponse.status}`);
        const userData = await userResponse.json();

        // 2. Fetch public events for recent activity
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=40`);
        if (!eventsResponse.ok) throw new Error(`GitHub API (Events) returned status: ${eventsResponse.status}`);
        const events = await eventsResponse.json();

        // 3. Filter and parse relevant activity (exclude empty pushes)
        const relevantEvents = events.filter((event: any) => {
            if (event.type === 'CreateEvent' || event.type === 'PullRequestEvent') return true;
            if (event.type === 'PushEvent') {
                const commits = event.payload?.commits || [];
                return commits.length > 0; // Only keep pushes that actually have commits
            }
            return false;
        });

        // Group relevant events by repository to give the LLM a broader, summarized context
        const repoActivity: Record<string, { pushes: number, prs: number, latestCommits: string[] }> = {};

        relevantEvents.slice(0, 25).forEach((event: any) => {
            const repoName = event.repo.name;
            if (!repoActivity[repoName]) {
                repoActivity[repoName] = { pushes: 0, prs: 0, latestCommits: [] };
            }

            if (event.type === 'PushEvent') {
                repoActivity[repoName].pushes += 1;
                const commits = event.payload?.commits || [];
                if (commits.length > 0 && repoActivity[repoName].latestCommits.length < 3) {
                    repoActivity[repoName].latestCommits.push(`"${commits[0].message.split('\n')[0]}"`);
                }
            } else if (event.type === 'PullRequestEvent') {
                repoActivity[repoName].prs += 1;
            }
        });

        // Format the grouped data into concise strings for the LLM
        const recentActivity = Object.entries(repoActivity).map(([repo, data]) => {
            const activitySummary = `Activity in ${repo}: ${data.pushes} pushes, ${data.prs} PRs. `;
            const commitSummary = data.latestCommits.length > 0
                ? `Recent work includes: ${data.latestCommits.join(', ')}.`
                : "";
            return activitySummary + commitSummary;
        });

        // Return a highly detailed JSON string for the LLM to read and summarize
        return JSON.stringify({
            status: "success",
            github_username: username,
            statistics: {
                public_repos: userData.public_repos,
                followers: userData.followers,
                bio: userData.bio || "No bio provided on GitHub"
            },
            recent_activity: recentActivity.length > 0 ? recentActivity : ["No recent public coding activity found."]
        });

    } catch (error: any) {
        console.error("Failed to fetch GitHub activity for Agent:", error);
        return JSON.stringify({
            status: "error",
            message: `Failed to fetch GitHub activity: ${error.message}`
        });
    }
};
