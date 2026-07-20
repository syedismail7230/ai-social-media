import { NextRequest, NextResponse } from "next/server";
import { Repository } from "@/lib/db/repository";

export async function GET() {
  const logs = Repository.getLogs();
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = Repository.addLog(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
