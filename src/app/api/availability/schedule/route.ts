import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability.server";
import { DAY_NAMES } from "@/lib/availability";

/**
 * Public endpoint — returns which days are off and which dates are blocked
 * so the client date picker can grey them out.
 */
export async function GET() {
  const config = getAvailability();

  // Return day-of-week status (0=Sun … 6=Sat) — only which are enabled
  const offDays = DAY_NAMES.map((d, i) => ({
    index: i,
    enabled: config.weeklySchedule[d].enabled,
  }))
    .filter((d) => !d.enabled)
    .map((d) => d.index);

  return NextResponse.json({
    offDays, // array of day-of-week indices that are off (0=Sun)
    blockedDates: config.blockedDates, // array of "YYYY-MM-DD"
  });
}
