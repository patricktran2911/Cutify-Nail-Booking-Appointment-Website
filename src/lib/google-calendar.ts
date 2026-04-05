import { google } from "googleapis";
import { BUSINESS_HOURS } from "./services";
import type { TimeSlot } from "@/types";

/**
 * Converts a local date + hour in the given IANA timezone to a UTC Date.
 * Uses the Intl offset-detection trick so DST is handled automatically.
 */
function localHourToUTC(dateStr: string, hour: number, timeZone: string): Date {
  const probe = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00Z`);
  const localStr = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(probe);
  const probeAsLocal = new Date(localStr.replace(" ", "T") + "Z");
  const offset = probe.getTime() - probeAsLocal.getTime();
  return new Date(probe.getTime() + offset);
}

function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Google Calendar credentials not configured");
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

function getCalendarId() {
  return process.env.GOOGLE_CALENDAR_ID ?? "primary";
}

export async function getAvailableSlots(
  date: string,
  durationMinutes: number
): Promise<TimeSlot[]> {
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  // Get timezone from environment or default to America/Los_Angeles
  const timeZone = process.env.TIMEZONE ?? "America/Los_Angeles";

  // Interpret business-hour boundaries in the salon's local timezone (not UTC)
  const dayStart = localHourToUTC(date, BUSINESS_HOURS.start, timeZone);
  const dayEnd = localHourToUTC(date, BUSINESS_HOURS.end, timeZone);

  // Query freebusy to find occupied times
  const freeBusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone,
      items: [{ id: calendarId }],
    },
  });

  const busySlots =
    freeBusy.data.calendars?.[calendarId]?.busy ?? [];

  // Generate all possible slots within business hours
  const slots: TimeSlot[] = [];
  const slotDuration = durationMinutes * 60 * 1000;

  let cursor = dayStart.getTime();
  const end = dayEnd.getTime();

  while (cursor + slotDuration <= end) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor + slotDuration);

    // Check if this slot overlaps with any busy period
    const isOccupied = busySlots.some((busy) => {
      const busyStart = new Date(busy.start!).getTime();
      const busyEnd = new Date(busy.end!).getTime();
      return cursor < busyEnd && cursor + slotDuration > busyStart;
    });

    if (!isOccupied) {
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        display: slotStart.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone,
        }),
      });
    }

    cursor += 30 * 60 * 1000; // 30-minute intervals
  }

  return slots;
}

interface BookingDetails {
  service: { name: string; price: number };
  artTier?: { name: string; tier: number; price: number } | null;
  removal?: { name: string; price: number } | null;
  date: string;
  timeSlot: { start: string; end: string };
  clientInfo: {
    name: string;
    phone: string;
    instagram: string;
    email: string;
    notes: string;
    isFirstTime: boolean;
    selectedDrink?: string | null;
  };
  total: number;
  depositPaid: boolean;
}

export async function createBookingEvent(
  details: BookingDetails
): Promise<string> {
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();
  const timeZone = process.env.TIMEZONE ?? "America/Los_Angeles";

  const lines = [
    `Client: ${details.clientInfo.name}`,
    `Phone: ${details.clientInfo.phone}`,
    details.clientInfo.instagram ? `Instagram: ${details.clientInfo.instagram}` : null,
    details.clientInfo.email ? `Email: ${details.clientInfo.email}` : null,
    "",
    `Service: ${details.service.name} ($${details.service.price})`,
    details.artTier
      ? `Nail Art: Tier ${details.artTier.tier} - ${details.artTier.name} (+$${details.artTier.price})`
      : null,
    details.removal
      ? `Removal: ${details.removal.name} (+$${details.removal.price})`
      : null,
    "",
    `Estimated Total: $${details.total}`,
    `Deposit ($15): ${details.depositPaid ? "PAID (PayPal)" : "PENDING (Manual)"}`,
    `Remaining: $${details.total - 15}`,
    "",
    details.clientInfo.selectedDrink
      ? `🧋 Drink: ${details.clientInfo.selectedDrink.split("::")[1] ?? details.clientInfo.selectedDrink}`
      : null,
    details.clientInfo.isFirstTime ? "🎀 First-time client!" : null,
    details.clientInfo.notes ? `Notes: ${details.clientInfo.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const event = await calendar.events.insert({
    calendarId,
    sendUpdates: "none",
    requestBody: {
      summary: `Cutify Nails — ${details.clientInfo.name}`,
      description: lines,
      start: {
        dateTime: details.timeSlot.start,
        timeZone,
      },
      end: {
        dateTime: details.timeSlot.end,
        timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 60 },
          { method: "popup", minutes: 1440 },
        ],
      },
    },
  });

  return event.data.id ?? "";
}
