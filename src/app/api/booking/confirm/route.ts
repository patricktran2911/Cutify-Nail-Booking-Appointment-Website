import { NextRequest, NextResponse } from "next/server";
import { verifyConfirmToken } from "@/lib/booking-token";
import { createBookingEvent } from "@/lib/google-calendar";
import { sendCustomerConfirmation } from "@/lib/email";

const successHtml = (clientName: string, date: string, time: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Booking Confirmed</title>
  <style>
    body { margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #f0fdf4; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 480px; width: 90%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { margin: 0 0 8px; font-size: 22px; color: #15803d; }
    p { margin: 0 0 6px; color: #6b7280; font-size: 15px; }
    .detail { font-weight: 600; color: #111827; }
    .note { margin-top: 24px; font-size: 13px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h1>Booking Confirmed!</h1>
    <p>Calendar event created for <span class="detail">${clientName}</span></p>
    <p><span class="detail">${date}</span> at <span class="detail">${time}</span></p>
    <p class="note">A confirmation email with calendar links has been sent to the customer.</p>
  </div>
</body>
</html>`;

const errorHtml = (message: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Error</title>
  <style>
    body { margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #fef2f2; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 480px; width: 90%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { margin: 0 0 8px; font-size: 22px; color: #dc2626; }
    p { margin: 0; color: #6b7280; font-size: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">❌</div>
    <h1>Something went wrong</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");

  if (!token) {
    return new NextResponse(errorHtml("Invalid link — no token provided."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const booking = verifyConfirmToken(token);
  if (!booking) {
    return new NextResponse(errorHtml("Invalid or tampered confirmation link. Please contact support."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const timeZone = process.env.TIMEZONE ?? "America/Los_Angeles";

    // Create the calendar event (deposit confirmed by owner)
    await createBookingEvent({
      service: booking.service,
      artTier: booking.artTier ?? null,
      removal: booking.removal ?? null,
      date: booking.date,
      timeSlot: booking.timeSlot,
      clientInfo: booking.clientInfo,
      total: booking.total,
      depositPaid: true,
    });

    // Build display strings for emails
    const dateDisplay = new Date(`${booking.date}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timeDisplay = booking.timeSlot.display ?? new Date(booking.timeSlot.start).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });

    // Send confirmation email to customer
    if (booking.clientInfo.email) {
      await sendCustomerConfirmation({
        to: booking.clientInfo.email,
        clientName: booking.clientInfo.name,
        serviceName: booking.service.name,
        artTierName: booking.artTier?.name ?? null,
        removalName: booking.removal?.name ?? null,
        date: dateDisplay,
        timeDisplay,
        timeSlotStart: booking.timeSlot.start,
        timeSlotEnd: booking.timeSlot.end,
        total: booking.total,
        selectedDrink: booking.clientInfo.selectedDrink ?? null,
        isFirstTime: booking.clientInfo.isFirstTime,
        notes: booking.clientInfo.notes || undefined,
      });
    }

    return new NextResponse(successHtml(booking.clientInfo.name, dateDisplay, timeDisplay), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Confirm booking error:", error);
    return new NextResponse(errorHtml("Failed to confirm booking. Check server logs."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
