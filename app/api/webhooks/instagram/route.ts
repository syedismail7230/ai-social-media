import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";
import { RagEngine } from "@/lib/ai/rag-engine";

// Helper to send message back to customer on Instagram via Meta Graph API
async function sendInstagramReply(recipientId: string, text: string) {
  const pageAccessToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) return;

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${pageAccessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    });
    const data = await res.json();
    console.log("[Meta Graph API Reply Sent]", data);
  } catch (err) {
    console.error("[Meta Graph API Reply Error]", err);
  }
}

// Meta Instagram Webhook Verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "zawr_verify_token_2026";

  console.log(`[Meta Webhook Verification] Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge || "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// Meta Instagram DM Event Handler (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object === "instagram" || body.entry) {
      for (const entry of body.entry || []) {
        const messaging = entry.messaging || [];
        for (const event of messaging) {
          if (event.message && event.message.text && !event.message.is_echo) {
            const senderId = event.sender.id;
            const messageText = event.message.text;
            const convId = `conv-${senderId}`;

            // 1. Ensure conversation exists in DB
            const existingConvs = Repository.getConversations();
            let conv = existingConvs.find((c) => c.id === convId);

            if (!conv) {
              conv = {
                id: convId,
                channel: "instagram",
                customerUsername: `user_${senderId.slice(-4)}`,
                customerName: `Instagram User ${senderId.slice(-4)}`,
                lastMessageText: messageText,
                lastMessageAt: new Date().toISOString(),
                unreadCount: 1,
                tags: ["Instagram DM"],
                leadScore: 70,
                leadTemperature: "hot",
                aiSummary: "Incoming live Instagram DM inquiry",
                assignedPersonalityId: "p1",
                status: "active",
              };
              Repository.addConversation(conv);

              // Also create lead profile
              Repository.addLead({
                id: `lead-${senderId}`,
                instagramUsername: conv.customerUsername,
                name: conv.customerName,
                leadScore: 70,
                leadTemperature: "hot",
                status: "new",
                expectedValue: 2500,
                priority: "high",
                tags: ["Instagram DM"],
                notes: "Captured via live Instagram DM",
                aiSummary: "Prospect engaged via Instagram direct message",
                conversationCount: 1,
                lastContactAt: new Date().toISOString(),
                decisionMaker: true,
              });
            }

            // 2. Add customer message to database
            Repository.addMessage({
              id: `m-cust-${Date.now()}`,
              conversationId: convId,
              sender: "customer",
              content: messageText,
              confidenceScore: 100,
              decisionRoute: "auto_reply",
              createdAt: new Date().toISOString(),
            });

            // 3. Evaluate AI response through RAG Engine
            const personalities = Repository.getPersonalities();
            const knowledge = Repository.getKnowledge();
            const ragResult = RagEngine.evaluateQuery(messageText, personalities[0] || { greetingStyle: "" }, knowledge);

            // 4. If confidence >= 95%, auto-reply and send back via Meta Graph API
            if (ragResult.decisionRoute === "auto_reply") {
              Repository.addMessage({
                id: `m-ai-${Date.now()}`,
                conversationId: convId,
                sender: "ai",
                content: ragResult.replyText,
                confidenceScore: ragResult.confidenceScore,
                decisionRoute: ragResult.decisionRoute,
                tokensUsed: 110,
                latencyMs: 380,
                provider: "gemini",
                createdAt: new Date().toISOString(),
              });

              await sendInstagramReply(senderId, ragResult.replyText);
            } else {
              // Push to Learning Queue for low confidence
              const db = (Repository as any).ensureDb();
              db.learningQueue = [
                {
                  id: `lq-${Date.now()}`,
                  question: messageText,
                  customerUsername: conv.customerUsername,
                  conversationId: convId,
                  aiSuggestion: ragResult.replyText,
                  status: "pending",
                  category: "services",
                  createdAt: new Date().toISOString(),
                },
                ...db.learningQueue,
              ];
              (Repository as any).saveDb(db);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook Handler Error]", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: String(error) },
      { status: 500 }
    );
  }
}
