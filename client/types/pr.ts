export interface PullRequest {
  number: number;
  title: string;
  author: string;
  requested_reviewers: string[];
  createdAt: string;
  lastAction: string;
  lastActionUser?: string;
  updatedAt: string;
  url: string;
  mergedAt?: string;
  closedAt?: string;
  state?: string; // "open" or "closed"

  commitCount?: number;
  firstReviewHours?: number | null;
}
