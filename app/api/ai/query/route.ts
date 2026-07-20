import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/ai/rag-engine";
import { initialPersonalities } from "@/lib/store/mock-data";

export async function POST(req: NextRequest) {
  try {
    const { prompt, personalityId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const personality =
      initialPersonalities.find((p) => p.id === personalityId) ||
      initialPersonalities[0];

    const result = RagEngine.evaluateQuery(prompt, personality);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "AI Query evaluation failed", details: String(err) },
      { status: 500 }
    );
  }
}
