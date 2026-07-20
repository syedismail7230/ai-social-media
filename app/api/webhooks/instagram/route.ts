import { NextRequest, NextResponse } from "next/server";
import { RagEngine } from "@/lib/ai/rag-engine";
import { initialPersonalities } from "@/lib/store/mock-data";

// Meta Instagram Webhook Verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "zawr_verify_token_2026";

  console.log(`[Meta Webhook Verification] Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    // Return plain text challenge as expected by Meta Webhook verification
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
          if (event.message && event.message.text) {
            const senderId = event.sender.id;
            const messageText = event.message.text;

            const ragResult = RagEngine.evaluateQuery(
              messageText,
              initialPersonalities[0]
            );

            if (ragResult.decisionRoute === "auto_reply") {
              console.log(
                `[Instagram DM Auto-Reply] To ${senderId}: ${ragResult.replyText}`
              );
            } else {
              console.log(
                `[Instagram DM Pending Escalation] To Learning Queue. Confidence: ${ragResult.confidenceScore}%`
              );
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook handler failed", details: String(error) },
      { status: 500 }
    );
  }
}
