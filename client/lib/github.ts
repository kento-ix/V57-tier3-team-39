// lib/github.ts
import { GitHubPR, GitHubComment, GitHubReview } from "@/types/github";
import { PullRequest } from "@/types/pr";

export async function fetchOpenPRs(owner: string, repo: string, token?: string): Promise<PullRequest[]> {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
    };
    if (token) headers.Authorization = `token ${token}`;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, { headers });
    if (!res.ok) throw new Error(`Invalid repository: ${owner}/${repo}`);

    const prsData = (await res.json()) as GitHubPR[];

    const mapped: PullRequest[] = await Promise.all(
        prsData.map(async (pr) => {
            let lastAction = "open";

            const reviewsRes = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews`,
                { headers }
            );
            const reviews = (await reviewsRes.json()) as GitHubReview[];
            if (reviews.length > 0) {
                const latest = reviews.at(-1);
                if (latest?.state === "APPROVED") lastAction = "approved";
                if (latest?.state === "CHANGES_REQUESTED") lastAction = "changes_requested";
            }

            const commentsRes = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/issues/${pr.number}/comments`,
                { headers }
            );
            const comments = (await commentsRes.json()) as GitHubComment[];
            if (comments.length > 0) lastAction = "commented";

            return {
                number: pr.number,
                title: pr.title,
                author: pr.user?.login ?? "Unknown",
                createdAt: pr.created_at,
                updatedAt: pr.updated_at,
                requested_reviewers: pr.requested_reviewers?.map((r) => r.login) ?? [],
                lastAction,
                url: pr.html_url,
            };
        })
    );
    
    return mapped;
}
