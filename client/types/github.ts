export interface GitHubPR {
    number: number;
    title: string;
    user: { login: string };
    created_at: string;
    updated_at: string;
    requested_reviewers: { login: string }[];
    html_url: string;
    merged_at?: string;
    closed_at?: string;
    state?: string; // "open" or "closed"
}

export interface GitHubUser {
    login: string;
    id?: number;
}

export interface GitHubReview {
    state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | string;
    user: GitHubUser;
    submitted_at?: string;
    body?: string;
}

export interface GitHubComment {
    user: GitHubUser;
    body: string;
    created_at: string;
    id: number;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author?: {
    login: string;
  };
  url: string;
}