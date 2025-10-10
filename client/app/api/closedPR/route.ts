// app/api/closedPR/route.ts
import { NextResponse } from "next/server";
import { fetchClosedPRs } from "@/lib/github";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const tokenParam = searchParams.get("token");
  const token = tokenParam && tokenParam.trim() !== "" ? tokenParam : process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 });
  }

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 10;

  try {
    const { prs, rateLimitRemaining } = await fetchClosedPRs(owner, repo, token ?? undefined, limit);
    return NextResponse.json({ prs, rateLimitRemaining });
  } catch (err: unknown) {
    let message = "🚨 Unable to fetch pull requests. Please try again later.";
    let status = 500;

    if (err instanceof Error) {
      const errMsg = err.message;
      if (errMsg.includes("404") || errMsg.includes("Invalid repository")) {
        message = "❌ Repository not found. Please check the repo name.";
        status = 404;
      } else if (errMsg.includes("403") || errMsg.includes("rate limit")) {
        message =
          "⚠️ GitHub API rate limit reached. Try again later or use a personal access token.";
        status = 429;
      } else if (errMsg.includes("Failed to fetch") || errMsg.includes("NetworkError")) {
        message = "🌐 Network error. Please check your connection and retry.";
        status = 503;
      }
    }

    return NextResponse.json({ error: message }, { status });
  }
}
