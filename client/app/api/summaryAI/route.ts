// app/api/summaryAI/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { title, body, diff } = await req.json();
    const safeDiff = diff ?? "";

    const prompt = `
        Please provide a concise summary of the following GitHub Pull Request for developers.
        Title: ${title}
        Body: ${body}
        Diff (excerpt): ${safeDiff.slice(0, 1000)}...
    `;

    const response = await client.responses.create({
      model: "gpt-4o",
      input: prompt,
    });

    const summary = response.output_text ?? "No summary generated.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI Summary Error:", error);
    return NextResponse.json(
      { summary: "Failed to generate AI summary." },
      { status: 500 }
    );
  }
}
