import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET() {
  const queue = Repository.getLearningQueue();
  return NextResponse.json(queue);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, ownerAnswer } = body;

    if (action === "approve") {
      const createdKnowledge = Repository.approveLearningItem(id, ownerAnswer);
      return NextResponse.json({ success: true, createdKnowledge });
    } else if (action === "reject") {
      Repository.rejectLearningItem(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
