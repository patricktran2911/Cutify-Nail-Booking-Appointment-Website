import { NextRequest, NextResponse } from "next/server";
import { sendManualBookingNotice } from "@/lib/email";
import { createConfirmToken } from "@/lib/booking-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, artTier, removal, timeSlot, date, clientInfo, total } = body;

    if (!service?.name || !timeSlot?.start || !date || !clientInfo?.name?.trim()) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    const timeZone = process.env.TIMEZONE ?? "America/Los_Angeles";

    const timeDisplay = new Date(timeSlot.start).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });

    const dateDisplay = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Build a signed confirm token with all booking data
    const token = createConfirmToken({
      service,
      artTier: artTier ?? null,
      removal: removal ?? null,
      timeSlot: { ...timeSlot, display: timeDisplay },
      date,
      clientInfo,
      total: total ?? service.price,
    });

    const appUrl = process.env.APP_URL ?? request.nextUrl.origin;
    const confirmUrl = `${appUrl}/api/booking/confirm?t=${token}`;

    await sendManualBookingNotice({
      clientName: clientInfo.name,
      clientPhone: clientInfo.phone,
      clientEmail: clientInfo.email,
      clientInstagram: clientInfo.instagram || undefined,
      serviceName: service.name,
      servicePrice: service.price,
      artTierName: artTier?.name ?? null,
      artTierPrice: artTier?.price ?? null,
      removalName: removal?.name ?? null,
      removalPrice: removal?.price ?? null,
      date: dateDisplay,
      timeDisplay,
      total: total ?? service.price,
      selectedDrink: clientInfo.selectedDrink ?? null,
      isFirstTime: clientInfo.isFirstTime ?? false,
      notes: clientInfo.notes || undefined,
      confirmUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manual booking notice error:", error);
    return NextResponse.json(
      { error: "Failed to send booking notice" },
      { status: 500 }
    );
  }
}
