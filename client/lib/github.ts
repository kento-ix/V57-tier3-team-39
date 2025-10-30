// lib/github.ts
import { GitHubPR, GitHubComment, GitHubReview } from "@/types/github";
import { PullRequest } from "@/types/pr";
import pLimit from "p-limit";
import { GitHubCommit } from "@/types/github";

async function safeFetch<T>(url: string, headers: Record<string, string>): Promise<{ data: T; rateLimitRemaining: number | null }> {
  try {
    const res = await fetch(url, { headers });
    const data: T = await res.json();
    const rateLimitRemaining = res.headers.get("X-RateLimit-Remaining");
    if (!res.ok) {
      const msg =
        typeof data === "object" && data !== null && "message" in data
          ? (data as { message: string }).message
          : `GitHub API error: ${res.status}`;
      throw new Error(msg);
    }
    return { data, rateLimitRemaining: rateLimitRemaining ? Number(rateLimitRemaining) : null };
  } catch (err: unknown) {
    if (err instanceof Error) throw err;
    throw new Error("Network error");
  }
}

async function mapPR(pr: GitHubPR, owner: string, repo: string, headers: Record<string, string>): Promise<PullRequest> {
  let lastAction = "open";
  let lastActionUser = pr.user?.login ?? "Unknown";

  // ---- Reviews ----
  const { data: reviews } = await safeFetch<GitHubReview[]>(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews`,
    headers
  );

  let firstReviewTime: number | null = null;
  const reviewers = new Set<string>();

  if (reviews.length > 0) {
    const sortedReviews = reviews.sort((a, b) => new Date(a.submitted_at ?? 0).getTime() - new Date(b.submitted_at ?? 0).getTime());
    firstReviewTime = (new Date(sortedReviews[0].submitted_at ?? 0).getTime() - new Date(pr.created_at).getTime()) / (1000 * 60 * 60);
    sortedReviews.forEach(r => reviewers.add(r.user.login));

    const latest = reviews.at(-1);
    if (latest) {
      if (latest.state === "APPROVED") {
        lastAction = "approved";
        lastActionUser = latest.user.login;
      }
      if (latest.state === "CHANGES_REQUESTED") {
        lastAction = "changes_requested";
        lastActionUser = latest.user.login;
      }
    }
  }

  // ---- Comments ----
  const { data: comments } = await safeFetch<GitHubComment[]>(
    `https://api.github.com/repos/${owner}/${repo}/issues/${pr.number}/comments`,
    headers
  );

  // ---- Commits ----
  const { data: commits } = await safeFetch<GitHubCommit[]>(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/commits`,
    headers
  );

  if (comments.length > 0) {
    const latestComment = comments.at(-1);
    if (latestComment) {
      lastAction = "commented";
      lastActionUser = latestComment.user.login;
    }
  }

  return {
    number: pr.number,
    title: pr.title,
    author: pr.user?.login ?? "Unknown",
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    requested_reviewers: Array.from(reviewers),
    commitCount: commits.length,
    firstReviewHours: firstReviewTime,
    lastAction,
    lastActionUser,
    url: pr.html_url,
    mergedAt: pr.merged_at ?? "",
    closedAt: pr.closed_at ?? "",
    state: pr.state ?? "",
  };
}


export async function fetchOpenPRs(owner: string, repo: string, token?: string, limit = 10) {
  const authToken = token || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const { data: prsData, rateLimitRemaining } = await safeFetch<GitHubPR[]>(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=${limit}`,
    headers
  );

  const concurrencyLimit = pLimit(3);
  const mapped: PullRequest[] = await Promise.all(
    prsData.map(pr => concurrencyLimit(() => mapPR(pr, owner, repo, headers)))
  );

  return { prs: mapped, rateLimitRemaining };
}

export async function fetchClosedPRs(owner: string, repo: string, token?: string, limit = 10) {
  const authToken = token || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const { data: prsData, rateLimitRemaining } = await safeFetch<GitHubPR[]>(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=${limit}`,
    headers
  );

  const concurrencyLimit = pLimit(3);
  const mapped: PullRequest[] = await Promise.all(
    prsData.map(pr => concurrencyLimit(() => mapPR(pr, owner, repo, headers)))
  );

  return { prs: mapped, rateLimitRemaining };
}
