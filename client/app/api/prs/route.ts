import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const token = searchParams.get("token");
    
    if (!owner || !repo) {
        return NextResponse.json({ error: "Owner and repo are required" },{ status: 400 });
    }
    

    try {
        const headers: any = {
            Accept: "application/vnd.github+json",
        };
        if (token) {
            headers.Authorization = `token ${token}`;
        }

        // PRs
        const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls?state=open`,
            { headers }
        );

        if (!res.ok) {
            return NextResponse.json({ error: "Invalid repository name" }, { status: res.status });
        }

        const prs = await res.json();

        const mapped = await Promise.all(
            prs.map(async (pr: any) => {
                let lastAction = pr.state;

                const reviewsRes = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews`,
                    { headers }
                );

                const reviews = await reviewsRes.json();
                if (reviews.length > 0) {
                    const latestReview = reviews[reviews.length - 1];
                    if (latestReview.state === "APPROVED") lastAction = "approved";
                    if (latestReview.state === "CHANGES_REQUESTED") lastAction = "changes_requested";
                }

                // Comments
                const commentsRes = await fetch(
                    `https://api.github.com/repos/${owner}/issues/${pr.number}/comments`,
                    { headers }
                );
                const comments = await commentsRes.json();
                if (comments.length > 0) {
                    lastAction = "commented";
                }

                return {
                    number: pr.number,
                    title: pr.title,
                    author: pr.user?.login ?? "Unknown",
                    createdAt: pr.created_at,
                    updatedAt: pr.updated_at,
                    requested_reviewers: pr.requested_reviewers?.map((r: any) => r.login) ?? [],
                    lastAction,
                    url: pr.html_url,
                };
            })
        );

        return NextResponse.json(mapped);

    } catch (err: any) {
        return NextResponse.json({error: err.message}, { status: 500 })
    }
}