import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google-calendar";
import { getDaySchedule } from "@/lib/availability.server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") ?? "60", 10);

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Invalid date parameter. Use YYYY-MM-DD format." },
      { status: 400 }
    );
  }

  if (isNaN(duration) || duration < 30 || duration > 180) {
    return NextResponse.json(
      { error: "Duration must be between 30 and 180 minutes." },
      { status: 400 }
    );
  }

  // Check admin availability schedule
  const dayHours = getDaySchedule(date);
  if (!dayHours) {
    // Day is off or blocked — no slots
    return NextResponse.json({ slots: [] });
  }

  try {
    const slots = await getAvailableSlots(date, duration, dayHours.start, dayHours.end);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Calendar availability error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
