// app/api/github/route.ts
import { NextResponse } from "next/server";
import { fetchOpenPRs } from "@/lib/github";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const token = searchParams.get("token") || process.env.GITHUB_TOKEN;

    if (!owner || !repo) {
        return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 });
    }

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 10;

    try {
        const prs = await fetchOpenPRs(owner, repo, token ?? undefined, limit);
        return NextResponse.json(prs);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
