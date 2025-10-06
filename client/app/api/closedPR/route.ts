import { NextResponse } from "next/server";
import { fetchClosedPRs } from "@/lib/github";


// API Route
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const token = searchParams.get("token") || process.env.GITHUB_TOKEN;

    if (!owner || !repo) {
        return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 });
    }

    try {
        const prs = await fetchClosedPRs(owner, repo, token ?? undefined);
        return NextResponse.json(prs);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}