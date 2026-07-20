import { NextRequest, NextResponse } from "next/server";
import { initialObjections } from "@/lib/store/mock-data";

let objectionStore = [...initialObjections];

export async function GET() {
  return NextResponse.json(objectionStore);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newObj = { id: `o-${Date.now()}`, ...body };
    objectionStore = [newObj, ...objectionStore];
    return NextResponse.json(newObj, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
