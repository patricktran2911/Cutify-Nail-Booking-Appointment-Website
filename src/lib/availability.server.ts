import fs from "fs";
import path from "path";
import { AvailabilityConfig, DEFAULT_AVAILABILITY, DAY_NAMES } from "./availability";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "availability.json");

export function getAvailability(): AvailabilityConfig {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as AvailabilityConfig;
  } catch {
    return DEFAULT_AVAILABILITY;
  }
}

export function saveAvailability(config: AvailabilityConfig): void {
  // Validate before saving
  if (!config.weeklySchedule || typeof config.weeklySchedule !== "object") {
    throw new Error("Invalid weeklySchedule");
  }

  for (const day of DAY_NAMES) {
    const sched = config.weeklySchedule[day];
    if (!sched || typeof sched.enabled !== "boolean") {
      throw new Error(`Invalid schedule for ${day}`);
    }
    if (sched.start < 0 || sched.start > 23 || sched.end < 0 || sched.end > 23) {
      throw new Error(`Invalid hours for ${day}`);
    }
    if (sched.enabled && sched.start >= sched.end) {
      throw new Error(`Start must be before end for ${day}`);
    }
  }

  if (!Array.isArray(config.blockedDates)) {
    throw new Error("blockedDates must be an array");
  }

  // Validate date format
  for (const d of config.blockedDates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      throw new Error(`Invalid date format: ${d}`);
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2));
}

/**
 * Returns the DaySchedule for a given date string (YYYY-MM-DD),
 * or null if the day is blocked or disabled.
 */
export function getDaySchedule(
  date: string
): { start: number; end: number } | null {
  const config = getAvailability();

  // Check blocked dates
  if (config.blockedDates.includes(date)) {
    return null;
  }

  // Determine day of week in LA timezone
  const timeZone = process.env.TIMEZONE ?? "America/Los_Angeles";
  const d = new Date(`${date}T12:00:00Z`);
  const dayName = d
    .toLocaleDateString("en-US", { weekday: "long", timeZone })
    .toLowerCase();

  const schedule = config.weeklySchedule[dayName];
  if (!schedule || !schedule.enabled) {
    return null;
  }

  return { start: schedule.start, end: schedule.end };
}
