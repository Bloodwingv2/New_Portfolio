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
    // We still keep a tiny local cache (e.g., 5 mins) to prevent spamming our own serverless function
    // during a single user session, but the heavy lifting and 3-hour cache is handled by Vercel Edge.
    const CACHE_TTL = 5 * 60 * 1000;
    if (githubCache.data && (Date.now() - githubCache.timestamp < CACHE_TTL)) {
        console.log("Serving GitHub activity from local React cache");
        return githubCache.data;
    }

    try {
        // In development, this relative path will hit the Vite proxy (if configured) or fail if testing purely locally without vercel CLI.
        // In production on Vercel, this perfectly routes to the Serverless Function.
        const response = await fetch(`/api/github?username=${username}`);

        if (!response.ok) {
            throw new Error(`Cached API returned status: ${response.status}`);
        }

        const data = await response.json();
        const payload = JSON.stringify(data);

        // Update local session cache
        githubCache = {
            timestamp: Date.now(),
            data: payload
        };

        return payload;

    } catch (error: any) {
        console.error("Failed to fetch GitHub activity from Edge Cache:", error);
        return JSON.stringify({
            status: "error",
            message: `Failed to fetch GitHub activity: ${error.message}`
        });
    }
};
