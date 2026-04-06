import { NextRequest, NextResponse } from "next/server";
import { getAvailability, saveAvailability } from "@/lib/availability.server";

export async function GET() {
  const config = getAvailability();
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    saveAvailability(body);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
