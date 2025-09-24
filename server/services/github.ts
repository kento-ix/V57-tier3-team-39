import fetch from "node-fetch";
import { GitHubComment, GitHubReview, GitHubPR, PullRequest } from "../types/github";

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

            // Reviews
            const reviewsRes = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews`,
                { headers }
            );
            const reviews = (await reviewsRes.json()) as GitHubReview[];
            if (reviews.length > 0) {
                const latestReview = reviews[reviews.length - 1];
                if (latestReview.state === "APPROVED") lastAction = "approved";
                if (latestReview.state === "CHANGES_REQUESTED") lastAction = "changes_requested";
            }

            // Comments
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
