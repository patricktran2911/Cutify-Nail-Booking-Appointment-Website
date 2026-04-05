import { NextRequest, NextResponse } from "next/server";
import { createBookingEvent } from "@/lib/google-calendar";
import { sendCustomerConfirmation, sendOwnerPayPalNotice } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { service, artTier, removal, timeSlot, date, clientInfo, total, depositPaid, paypalOrderId } = body;

    // Basic validation
    if (!service?.name || !service?.price) {
      return NextResponse.json({ error: "Service is required" }, { status: 400 });
    }
    if (!timeSlot?.start || !timeSlot?.end) {
      return NextResponse.json({ error: "Time slot is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    if (!clientInfo?.name?.trim() || !clientInfo?.phone?.trim()) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const eventId = await createBookingEvent({
      service,
      artTier: artTier ?? null,
      removal: removal ?? null,
      date,
      timeSlot,
      clientInfo,
      total: total ?? service.price,
      depositPaid: depositPaid ?? false,
    });

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

    const emailPayload = {
      clientName: clientInfo.name,
      serviceName: service.name,
      artTierName: artTier?.name ?? null,
      removalName: removal?.name ?? null,
      date: dateDisplay,
      timeDisplay,
      timeSlotStart: timeSlot.start,
      timeSlotEnd: timeSlot.end,
      total: total ?? service.price,
      selectedDrink: clientInfo.selectedDrink ?? null,
      isFirstTime: clientInfo.isFirstTime ?? false,
      notes: clientInfo.notes || undefined,
    };

    // Send customer confirmation (non-blocking)
    if (clientInfo.email) {
      sendCustomerConfirmation({ to: clientInfo.email, ...emailPayload })
        .catch((err) => console.error("Customer confirmation email failed:", err));
    }

    // Notify owner (non-blocking)
    sendOwnerPayPalNotice({
      ...emailPayload,
      clientPhone: clientInfo.phone,
      clientEmail: clientInfo.email,
      clientInstagram: clientInfo.instagram || undefined,
      servicePrice: service.price,
      artTierPrice: artTier?.price ?? null,
      removalPrice: removal?.price ?? null,
      paypalOrderId: paypalOrderId ?? null,
    }).catch((err) => console.error("Owner PayPal notice email failed:", err));

    return NextResponse.json({
      success: true,
      eventId,
      depositPaid,
      paypalOrderId: paypalOrderId ?? null,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
