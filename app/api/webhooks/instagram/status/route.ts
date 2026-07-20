import { NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET() {
  const conversations = Repository.getConversations();
  const logs = Repository.getLogs();

  return NextResponse.json({
    webhookStatus: "active",
    totalConversationsRecorded: conversations.length,
    recentConversations: conversations.slice(0, 5),
    recentLogs: logs.slice(0, 5),
    hasPageToken: Boolean(process.env.INSTAGRAM_PAGE_ACCESS_TOKEN),
    hasVerifyToken: Boolean(process.env.META_VERIFY_TOKEN),
    hasDbUrl: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString(),
  });
}
