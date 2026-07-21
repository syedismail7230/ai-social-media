import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recipientId = searchParams.get("recipientId");
  const text = searchParams.get("text") || "Hello! This is a test message from Zawr AI Engine.";
  const pageAccessToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;

  if (!pageAccessToken) {
    return NextResponse.json({ error: "INSTAGRAM_PAGE_ACCESS_TOKEN is missing in environment variables" }, { status: 400 });
  }

  if (!recipientId) {
    return NextResponse.json(
      {
        message: "Usage: /api/test-reply?recipientId=YOUR_INSTAGRAM_USER_ID&text=YourMessage",
        hasToken: true,
        tokenPrefix: pageAccessToken.slice(0, 15) + "...",
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${encodeURIComponent(pageAccessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text },
          messaging_type: "RESPONSE",
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json({ status: res.status, ok: res.ok, data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
