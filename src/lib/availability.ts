/**
 * Availability types & defaults — safe for client and server imports.
 */

export interface DaySchedule {
  enabled: boolean;
  start: number; // hour 0-23
  end: number;   // hour 0-23
}

export interface AvailabilityConfig {
  /** Weekly recurring schedule. Key = lowercase day name. */
  weeklySchedule: Record<string, DaySchedule>;
  /** Specific dates that are blocked (YYYY-MM-DD). */
  blockedDates: string[];
}

export const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export const DAY_LABELS: Record<string, string> = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
};

/** Default schedule: Mon–Sat 10 AM–6 PM, Sunday off */
export const DEFAULT_AVAILABILITY: AvailabilityConfig = {
  weeklySchedule: {
    sunday: { enabled: false, start: 10, end: 18 },
    monday: { enabled: true, start: 10, end: 18 },
    tuesday: { enabled: true, start: 10, end: 18 },
    wednesday: { enabled: true, start: 10, end: 18 },
    thursday: { enabled: true, start: 10, end: 18 },
    friday: { enabled: true, start: 10, end: 18 },
    saturday: { enabled: true, start: 10, end: 18 },
  },
  blockedDates: [],
};
