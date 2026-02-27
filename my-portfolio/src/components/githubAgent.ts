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
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=15`);
        if (!eventsResponse.ok) throw new Error(`GitHub API (Events) returned status: ${eventsResponse.status}`);
        const events = await eventsResponse.json();

        // 3. Filter and parse relevant activity
        const relevantEvents = events.filter((event: any) =>
            event.type === 'PushEvent' || event.type === 'CreateEvent' || event.type === 'PullRequestEvent'
        );

        let recentActivity = [];
        if (relevantEvents.length > 0) {
            recentActivity = relevantEvents.slice(0, 5).map((event: any) => {
                const repoName = event.repo.name;
                const date = new Date(event.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                if (event.type === 'PushEvent') {
                    const commits = event.payload.commits || [];
                    const commitsCount = commits.length;
                    const branch = event.payload.ref ? event.payload.ref.replace('refs/heads/', '') : 'unknown';

                    // Get up to 2 recent commit messages for context
                    const commitMessages = commits.length > 0
                        ? commits.slice(0, 2).map((c: any) => `- "${c.message.split('\n')[0]}"`).join(' | ')
                        : "No specific commit messages available";

                    return `[${date}] Pushed ${commitsCount} commit(s) to branch '${branch}' in ${repoName}. Details: ${commitMessages}`;

                } else if (event.type === 'CreateEvent') {
                    const refType = event.payload.ref_type;
                    return `[${date}] Created a new ${refType} in ${repoName}.`;

                } else if (event.type === 'PullRequestEvent') {
                    const action = event.payload.action;
                    const prTitle = event.payload.pull_request.title;
                    return `[${date}] ${action} a Pull Request in ${repoName}: "${prTitle}"`;
                }

                return `[${date}] Activity in ${repoName}.`;
            });
        }

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
