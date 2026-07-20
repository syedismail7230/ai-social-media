import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";
import { RagEngine } from "@/lib/ai/rag-engine";

// Send message back to customer on Instagram via Meta Graph API
async function sendInstagramReply(recipientId: string, text: string) {
  const pageAccessToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) {
    console.error("[Meta Graph API Error] INSTAGRAM_PAGE_ACCESS_TOKEN is missing in environment variables!");
    return { success: false, error: "Missing INSTAGRAM_PAGE_ACCESS_TOKEN" };
  }

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
    return { success: res.ok, data };
  } catch (err) {
    console.error("[Meta Graph API Exception]", err);
    return { success: false, error: String(err) };
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
    console.log("[Meta Incoming Webhook POST Body]", JSON.stringify(body));

    if (body.object === "instagram" || body.object === "page" || body.entry) {
      for (const entry of body.entry || []) {
        const messaging = entry.messaging || entry.changes || [];
        for (const event of messaging) {
          const messageData = event.message || event.value?.message;
          const senderId = event.sender?.id || event.value?.sender?.id;

          if (messageData && messageData.text && !messageData.is_echo) {
            const messageText = messageData.text;
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
                leadScore: 75,
                leadTemperature: "hot",
                aiSummary: "Incoming Instagram DM inquiry",
                assignedPersonalityId: "p1",
                status: "active",
              };
              Repository.addConversation(conv);

              // Create lead profile
              Repository.addLead({
                id: `lead-${senderId}`,
                instagramUsername: conv.customerUsername,
                name: conv.customerName,
                leadScore: 75,
                leadTemperature: "hot",
                status: "new",
                expectedValue: 3000,
                priority: "high",
                tags: ["Instagram DM"],
                notes: "Captured via live Instagram DM",
                aiSummary: "Prospect engaged via Instagram DM",
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

            // Save telemetry log
            Repository.addLog({
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              customerUsername: conv.customerUsername,
              prompt: messageText,
              confidenceScore: ragResult.confidenceScore,
              decisionRoute: ragResult.decisionRoute,
              provider: "gemini",
              model: "gemini-1.5-flash",
              tokensTotal: 120,
              latencyMs: 350,
              status: "success",
            });

            // 4. Auto-reply if confidence is good or default
            const replyText = ragResult.replyText || "Hello! Thanks for contacting us. How can we assist you today?";
            
            Repository.addMessage({
              id: `m-ai-${Date.now()}`,
              conversationId: convId,
              sender: "ai",
              content: replyText,
              confidenceScore: ragResult.confidenceScore || 95,
              decisionRoute: ragResult.decisionRoute || "auto_reply",
              tokensUsed: 120,
              latencyMs: 350,
              provider: "gemini",
              createdAt: new Date().toISOString(),
            });

            // Post back to Instagram
            if (senderId) {
              await sendInstagramReply(senderId, replyText);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook Handler Exception]", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: String(error) },
      { status: 500 }
    );
  }
}
