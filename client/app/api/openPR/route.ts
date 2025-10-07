// app/api/closedPR/route.ts
import { NextResponse } from "next/server";
import { fetchOpenPRs } from "@/lib/github";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const token = searchParams.get("token") || process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Owner and repo are required" },
      { status: 400 }
    );
  }

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 10;

  try {
    const prs = await fetchOpenPRs(owner, repo, token ?? undefined, limit);
    return NextResponse.json(prs);
  } catch (err: any) {
    let message = "🚨 Unable to fetch pull requests. Please try again later.";

    if (err instanceof Error) {
      const errMsg = err.message;

      if (errMsg.includes("404") || errMsg.includes("Invalid repository")) {
        message = "❌ Repository not found. Please check the repo name.";
      } else if (errMsg.includes("403") || errMsg.includes("rate limit")) {
        message =
          "⚠️ GitHub API rate limit reached. Try again later or use a personal access token.";
      } else if (
        errMsg.includes("Failed to fetch") ||
        errMsg.includes("NetworkError")
      ) {
        message = "🌐 Network error. Please check your connection and retry.";
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
