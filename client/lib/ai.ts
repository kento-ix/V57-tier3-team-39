// lib/ai.ts
export async function fetchAISummary(pr: {
  title: string;
  body: string;
  diff?: string;
}): Promise<string> {
  try {
    const res = await fetch("/api/summaryAI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: pr.title,
        body: pr.body,
        diff: pr.diff ?? "",
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        console.warn("OpenAI API quota exceeded.");
        return "⚠️ AI要約はクォータ超過のため利用できません。しばらく待ってから再試行してください。";
      }

      const text = await res.text();
      console.error("AI Summary API Error:", res.status, text);
      return "Failed to fetch AI summary.";
    }

    const data = await res.json();
    return data.summary ?? "No summary generated.";
  } catch (err) {
    console.error("AI Summary Fetch Error:", err);
    return "Failed to fetch AI summary.";
  }
}
