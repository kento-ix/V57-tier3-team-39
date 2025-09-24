export interface GitHubPR {
    number: number;
    title: string;
    user: { login: string };
    created_at: string;
    updated_at: string;
    requested_reviewers?: { login: string }[];
    html_url: string;
}

export interface GitHubReview {
    state: "APPROVED" | "CHANGES_REQUESTED" | string;
}

export interface GitHubComment {
    id: number;
    body: string;
}

export interface PullRequest {
    number: number;
    title: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    requested_reviewers: string[];
    lastAction: string;
    url: string;
}
