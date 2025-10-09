// lib/github.ts
import { GitHubPR, GitHubComment, GitHubReview } from "@/types/github";
import { PullRequest } from "@/types/pr";
import pLimit from "p-limit";

async function safeFetch(url: string, headers: Record<string, string>) {
  try {
    const res = await fetch(url, { headers });
    const data = await res.json();

    const rateLimitRemaining = res.headers.get("X-RateLimit-Remaining");

    if (!res.ok) {
      const msg = (data && data.message) || `GitHub API error: ${res.status}`;
      throw new Error(msg);
    }

    return { data, rateLimitRemaining };
  } catch (err: any) {
    throw new Error(err.message || "Network error");
  }
}

async function mapPR(
  pr: GitHubPR,
  owner: string,
  repo: string,
  headers: Record<string, string>
): Promise<PullRequest> {
  let lastAction = "open";
  let lastActionUser = pr.user?.login ?? "Unknown";

  // Reviews
  const { data: reviews } = await safeFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews`,
    headers
  ) as { data: GitHubReview[] };

  if (reviews.length > 0) {
    const latest = reviews.at(-1);
    if (latest) {
      if (latest.state === "APPROVED") {
        lastAction = "approved";
        lastActionUser = latest.user?.login ?? "Unknown";
      }
      if (latest.state === "CHANGES_REQUESTED") {
        lastAction = "changes_requested";
        lastActionUser = latest.user?.login ?? "Unknown";
      }
    }
  }

  // Comments
  const { data: comments } = await safeFetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${pr.number}/comments`,
    headers
  ) as { data: GitHubComment[] };

  if (comments.length > 0) {
    const latestComment = comments.at(-1);
    if (latestComment) {
      lastAction = "commented";
      lastActionUser = latestComment.user?.login ?? "Unknown";
    }
  }

  return {
    number: pr.number,
    title: pr.title,
    author: pr.user?.login ?? "Unknown",
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    requested_reviewers: pr.requested_reviewers?.map(r => r.login) ?? [],
    lastAction,
    lastActionUser,
    url: pr.html_url,
    mergedAt: pr.merged_at ?? "",
    closedAt: pr.closed_at ?? "",
    state: pr.state ?? "",
  };
}

export async function fetchOpenPRs(
  owner: string,
  repo: string,
  token?: string,
  limit: number = 10
): Promise<{ prs: PullRequest[]; rateLimitRemaining: number | null }> {
  const authToken = token || process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const { data: prsData, rateLimitRemaining } = await safeFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=${limit}`,
    headers
  );

  const concurrencyLimit = pLimit(3);
  const mapped: PullRequest[] = await Promise.all(
    (prsData as GitHubPR[]).map(pr => concurrencyLimit(() => mapPR(pr, owner, repo, headers)))
  );

  return { prs: mapped, rateLimitRemaining: rateLimitRemaining ? Number(rateLimitRemaining) : null };
}

export async function fetchClosedPRs(
  owner: string,
  repo: string,
  token?: string,
  limit: number = 10
): Promise<{ prs: PullRequest[]; rateLimitRemaining: number | null }> {
  const authToken = token || process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const { data: prsData, rateLimitRemaining } = await safeFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=${limit}`,
    headers
  );

  const concurrencyLimit = pLimit(3);
  const mapped: PullRequest[] = await Promise.all(
    (prsData as GitHubPR[]).map(pr => concurrencyLimit(() => mapPR(pr, owner, repo, headers)))
  );

  return { prs: mapped, rateLimitRemaining: rateLimitRemaining ? Number(rateLimitRemaining) : null };
}
