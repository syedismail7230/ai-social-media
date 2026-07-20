import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";
import { RagEngine } from "@/lib/ai/rag-engine";
import { Repository as Repo } from "@/lib/db/repository";
import { Message } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId query param is required" }, { status: 400 });
  }

  const messages = Repository.getMessages(conversationId);
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, sender, content } = body;

    if (!conversationId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId,
      sender: sender || "customer",
      content,
      confidenceScore: 100,
      decisionRoute: "auto_reply",
      createdAt: new Date().toISOString(),
    };

    Repository.addMessage(newMsg);

    // If sender is customer, automatically run AI RAG engine and save AI reply to database in real-time
    if (sender === "customer") {
      const personalities = Repo.getPersonalities();
      const knowledge = Repo.getKnowledge();
      const activePersonality = personalities[0];

      const ragResult = RagEngine.evaluateQuery(content, activePersonality, knowledge);

      const aiMsg: Message = {
        id: `m-ai-${Date.now()}`,
        conversationId,
        sender: "ai",
        content: ragResult.replyText,
        confidenceScore: ragResult.confidenceScore,
        decisionRoute: ragResult.decisionRoute,
        tokensUsed: 120,
        latencyMs: 420,
        provider: "gemini",
        createdAt: new Date().toISOString(),
      };

      Repository.addMessage(aiMsg);

      // If low confidence (<80%), push question to Owner Learning Queue in real-time
      if (ragResult.isUnknownQuestion) {
        Repository.getLearningQueue();
        const learningItem = {
          id: `lq-${Date.now()}`,
          question: content,
          customerUsername: "customer_ig",
          conversationId,
          aiSuggestion: "Zawr AI Assistant is confirming exact policy with owner.",
          status: "pending" as const,
          category: "services" as const,
          createdAt: new Date().toISOString(),
        };
        const db = (Repository as any).ensureDb();
        db.learningQueue = [learningItem, ...db.learningQueue];
        (Repository as any).saveDb(db);
      }
    }

    const updatedMessages = Repository.getMessages(conversationId);
    return NextResponse.json(updatedMessages, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
