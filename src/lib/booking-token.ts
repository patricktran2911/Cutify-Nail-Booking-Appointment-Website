import { createHmac, timingSafeEqual } from "crypto";

export interface PendingBooking {
  service: { name: string; price: number };
  artTier?: { name: string; tier: number; price: number } | null;
  removal?: { name: string; price: number } | null;
  timeSlot: { start: string; end: string; display: string };
  date: string;
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
}

export function createConfirmToken(booking: PendingBooking): string {
  const secret = process.env.BOOKING_SECRET;
  if (!secret) throw new Error("BOOKING_SECRET not configured");
  const payload = Buffer.from(JSON.stringify(booking)).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyConfirmToken(token: string): PendingBooking | null {
  const secret = process.env.BOOKING_SECRET;
  if (!secret) return null;

  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const payload = token.substring(0, dotIndex);
  const sig = token.substring(dotIndex + 1);
  const expectedSig = createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;
  } catch {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as PendingBooking;
  } catch {
    return null;
  }
}
