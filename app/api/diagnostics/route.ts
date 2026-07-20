import { NextResponse } from "next/server";
import { initialDiagnostics } from "@/lib/store/mock-data";

export async function GET() {
  return NextResponse.json(initialDiagnostics, { status: 200 });
}
