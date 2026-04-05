import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Gmail credentials not configured");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS (port 465/SMTPS is blocked on Hetzner)
    requireTLS: true,
    auth: { user, pass },
  });
}

export interface ManualBookingNoticeData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientInstagram?: string;
  serviceName: string;
  servicePrice: number;
  artTierName?: string | null;
  artTierPrice?: number | null;
  removalName?: string | null;
  removalPrice?: number | null;
  date: string;
  timeDisplay: string;
  total: number;
  selectedDrink?: string | null;
  isFirstTime: boolean;
  notes?: string;
  confirmUrl: string;
}

export async function sendManualBookingNotice(data: ManualBookingNoticeData) {
  const transporter = getTransporter();
  const ownerEmail = process.env.GMAIL_USER!;

  const drinkLine = data.selectedDrink
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3e8ff;">🧋 Drink</td><td style="padding:8px 16px;font-size:14px;font-weight:600;color:#e879b0;border-bottom:1px solid #f3e8ff;">${data.selectedDrink.split("::")[1] ?? data.selectedDrink}</td></tr>`
    : "";

  const artTierLine = data.artTierName
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3e8ff;">Nail Art</td><td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #f3e8ff;">Tier — ${data.artTierName} (+$${data.artTierPrice})</td></tr>`
    : "";

  const removalLine = data.removalName
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3e8ff;">Removal</td><td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #f3e8ff;">${data.removalName} (+$${data.removalPrice})</td></tr>`
    : "";

  const instagramLine = data.clientInstagram
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3e8ff;">Instagram</td><td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #f3e8ff;">${data.clientInstagram}</td></tr>`
    : "";

  const notesLine = data.notes
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;">Notes</td><td style="padding:8px 16px;font-size:14px;">${data.notes}</td></tr>`
    : "";

  const firstTimeBadge = data.isFirstTime
    ? `<span style="display:inline-block;margin-left:8px;background:#fdf2f8;color:#e879b0;font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;border:1px solid #fbcfe8;">🎀 First Visit</span>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07);">

        <!-- Alert header -->
        <tr>
          <td style="background:#fef3c7;border-bottom:2px solid #fbbf24;padding:20px 32px;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#92400e;">
              ⚠️ New Booking — Deposit Pending Verification
            </p>
            <p style="margin:6px 0 0;font-size:13px;color:#78350f;">
              A customer submitted a booking and said they'll pay the $15 deposit via Zelle/Venmo.
              Check your Zelle/Venmo, then add this to your calendar.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">

            <!-- Appointment info -->
            <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#111827;">
              📅 Appointment Details
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3e8ff;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#fdf4ff;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3e8ff;width:130px;">Date</td>
                <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #f3e8ff;">${data.date}</td>
              </tr>
              <tr>
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3e8ff;">Time</td>
                <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #f3e8ff;">${data.timeDisplay}</td>
              </tr>
              <tr style="background:#fdf4ff;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3e8ff;">Service</td>
                <td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #f3e8ff;">${data.serviceName} ($${data.servicePrice})</td>
              </tr>
              ${artTierLine}
              ${removalLine}
              ${drinkLine}
              <tr style="background:#fdf4ff;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Total Est.</td>
                <td style="padding:8px 16px;font-size:15px;font-weight:700;color:#e879b0;">$${data.total}</td>
              </tr>
            </table>

            <!-- Client info -->
            <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#111827;">
              👤 Client Info ${firstTimeBadge}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f9fafb;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;width:130px;">Name</td>
                <td style="padding:8px 16px;font-size:14px;font-weight:600;border-bottom:1px solid #e5e7eb;">${data.clientName}</td>
              </tr>
              <tr>
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Phone</td>
                <td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #e5e7eb;"><a href="tel:${data.clientPhone}" style="color:#e879b0;">${data.clientPhone}</a></td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Email</td>
                <td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${data.clientEmail}" style="color:#e879b0;">${data.clientEmail}</a></td>
              </tr>
              ${instagramLine}
              ${notesLine}
            </table>

            <!-- Action box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-radius:8px;border:1px solid #fbbf24;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#92400e;">✅ Action Required</p>
                  <ol style="margin:8px 0 0;padding-left:20px;font-size:13px;color:#78350f;line-height:1.8;">
                    <li>Check Zelle (916-918-4493) or Venmo (@joziecozie) for a $15 deposit from <strong>${data.clientName}</strong></li>
                    <li>If received → click the button below to confirm. This will add it to your calendar and notify the customer.</li>
                    <li>If NOT received within 24h → contact them at <strong>${data.clientPhone}</strong></li>
                  </ol>
                </td>
              </tr>
            </table>

            <!-- Confirm button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${data.confirmUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;">
                    ✅ Deposit Received — Confirm Booking
                  </a>
                  <p style="margin:10px 0 0;font-size:12px;color:#9ca3af;">Clicking this will create the calendar event and email the customer their confirmation.</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Cutify Nails booking system — thienngankim0205@gmail.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Cutify Nails Bookings" <${ownerEmail}>`,
    to: ownerEmail,
    subject: `⚠️ Booking Request — ${data.clientName} — ${data.date} ${data.timeDisplay} — Deposit Pending`,
    html,
  });
}

// ─── Customer confirmation email ─────────────────────────────────────────────

export interface CustomerConfirmationData {
  to: string;
  clientName: string;
  serviceName: string;
  artTierName?: string | null;
  removalName?: string | null;
  date: string;
  timeDisplay: string;
  timeSlotStart: string;
  timeSlotEnd: string;
  total: number;
  selectedDrink?: string | null;
  isFirstTime: boolean;
  notes?: string;
}

function toICSDate(iso: string): string {
  // "2026-04-05T17:00:00.000Z" → "20260405T170000Z"
  return iso.replace(/[-:]/g, "").split(".")[0] + "Z";
}

function toGCalDate(iso: string): string {
  return toICSDate(iso);
}

export async function sendCustomerConfirmation(data: CustomerConfirmationData) {
  const transporter = getTransporter();
  const from = process.env.GMAIL_USER!;

  const drinkLine = data.selectedDrink
    ? `<tr><td style="padding:10px 16px;color:#9ca3af;font-size:14px;background:#fdf8f6;">🧋 Drink</td><td style="padding:10px 16px;font-weight:600;font-size:14px;color:#e879b0;background:#fdf8f6;">${data.selectedDrink.split("::")[1] ?? data.selectedDrink}</td></tr>`
    : "";

  const artTierLine = data.artTierName
    ? `<tr><td style="padding:10px 16px;color:#9ca3af;font-size:14px;border-top:1px solid #fce7f3;">Nail Art</td><td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #fce7f3;">${data.artTierName}</td></tr>`
    : "";

  const removalLine = data.removalName
    ? `<tr><td style="padding:10px 16px;color:#9ca3af;font-size:14px;border-top:1px solid #fce7f3;">Removal</td><td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #fce7f3;">${data.removalName}</td></tr>`
    : "";

  const firstTimeBanner = data.isFirstTime
    ? `<p style="margin:16px 0 0;padding:12px 16px;background:#fdf2f8;border-left:3px solid #e879b0;border-radius:4px;color:#9d3e74;font-size:14px;">🎀 First visit — can't wait to meet you!</p>`
    : "";

  // Google Calendar link
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent("Cutify Nails Appointment")}` +
    `&dates=${toGCalDate(data.timeSlotStart)}/${toGCalDate(data.timeSlotEnd)}` +
    `&details=${encodeURIComponent(`Service: ${data.serviceName}\nEstimated Total: $${data.total}\n\n📌 Clean bare nails required. Text (916) 918-4493 with any questions.`)}` +
    `&sf=true&output=xml`;

  // ICS file content
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cutify Nails//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(data.timeSlotStart)}`,
    `DTEND:${toICSDate(data.timeSlotEnd)}`,
    "SUMMARY:Cutify Nails Appointment",
    `DESCRIPTION:Service: ${data.serviceName}\\nEstimated Total: $${data.total}\\n\\nPlease come with clean bare nails. Text (916) 918-4493 with any questions.`,
    `UID:cutify-${Date.now()}@cutify-nails`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#fdf8f6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f6;padding:40px 0;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#f472b6,#e879b0);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Cutify Nails ✨</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your Appointment is Confirmed!</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 24px;font-size:16px;color:#374151;">
              Hi <strong>${data.clientName}</strong>! 🌸 Your deposit has been received and your appointment is officially booked. See you soon!
            </p>

            <!-- Details table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fce7f3;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#fdf2f8;">
                <td colspan="2" style="padding:12px 16px;font-weight:700;color:#9d3e74;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Appointment Summary</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#9ca3af;font-size:14px;width:140px;border-top:1px solid #fce7f3;">Date</td>
                <td style="padding:10px 16px;font-weight:700;font-size:14px;color:#111827;border-top:1px solid #fce7f3;">${data.date}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#9ca3af;font-size:14px;border-top:1px solid #fce7f3;">Time</td>
                <td style="padding:10px 16px;font-weight:700;font-size:14px;color:#111827;border-top:1px solid #fce7f3;">${data.timeDisplay}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#9ca3af;font-size:14px;border-top:1px solid #fce7f3;">Service</td>
                <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #fce7f3;">${data.serviceName}</td>
              </tr>
              ${artTierLine}
              ${removalLine}
              ${drinkLine}
              <tr>
                <td style="padding:10px 16px;color:#9ca3af;font-size:14px;border-top:1px solid #fce7f3;">Deposit Paid</td>
                <td style="padding:10px 16px;font-size:14px;font-weight:600;color:#16a34a;border-top:1px solid #fce7f3;">$15 ✓</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#9ca3af;font-size:14px;border-top:1px solid #fce7f3;">Remaining</td>
                <td style="padding:10px 16px;font-size:14px;color:#111827;border-top:1px solid #fce7f3;">$${data.total - 15} (due at appointment)</td>
              </tr>
            </table>

            ${firstTimeBanner}

            <!-- Add to calendar -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td align="center" style="padding-bottom:8px;">
                  <a href="${gcalUrl}" target="_blank" style="display:inline-block;background:#4285f4;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
                    📅 Add to Google Calendar
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <p style="margin:0;font-size:12px;color:#9ca3af;">Or open the attached <strong>.ics</strong> file to add to Apple Calendar or Outlook</p>
                </td>
              </tr>
            </table>

            <!-- Policy reminder -->
            <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
              📌 Please come with <strong>clean, bare nails</strong> (no gel/polish). Cancellations with less than 24 hours notice forfeit the deposit. Questions? Text (916) 918-4493 or DM <a href="https://www.instagram.com/cutify_nails" style="color:#e879b0;">@cutify_nails</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fdf2f8;padding:20px 40px;text-align:center;border-top:1px solid #fce7f3;">
            <p style="margin:0;font-size:12px;color:#d1a8c0;">Cutify Nails by Ngan 💕</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Cutify Nails ✨" <${from}>`,
    to: data.to,
    subject: `Your Cutify Nails appointment is confirmed! 🌸 — ${data.date} ${data.timeDisplay}`,
    html,
    attachments: [
      {
        filename: "cutify-nails-appointment.ics",
        content: icsContent,
        contentType: "text/calendar",
      },
    ],
  });
}

// ─── Owner notification for PayPal-paid bookings ─────────────────────────────

export interface OwnerPayPalNoticeData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientInstagram?: string;
  serviceName: string;
  servicePrice: number;
  artTierName?: string | null;
  artTierPrice?: number | null;
  removalName?: string | null;
  removalPrice?: number | null;
  date: string;
  timeDisplay: string;
  total: number;
  selectedDrink?: string | null;
  isFirstTime: boolean;
  notes?: string;
  paypalOrderId?: string | null;
}

export async function sendOwnerPayPalNotice(data: OwnerPayPalNoticeData) {
  const transporter = getTransporter();
  const ownerEmail = process.env.GMAIL_USER!;

  const artTierLine = data.artTierName
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #dcfce7;">Nail Art</td><td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #dcfce7;">${data.artTierName} (+$${data.artTierPrice})</td></tr>`
    : "";

  const removalLine = data.removalName
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #dcfce7;">Removal</td><td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #dcfce7;">${data.removalName} (+$${data.removalPrice})</td></tr>`
    : "";

  const drinkLine = data.selectedDrink
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #dcfce7;">🧋 Drink</td><td style="padding:8px 16px;font-size:14px;font-weight:600;color:#e879b0;border-bottom:1px solid #dcfce7;">${data.selectedDrink.split("::")[1] ?? data.selectedDrink}</td></tr>`
    : "";

  const instagramLine = data.clientInstagram
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Instagram</td><td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #e5e7eb;">${data.clientInstagram}</td></tr>`
    : "";

  const notesLine = data.notes
    ? `<tr><td style="padding:8px 16px;color:#6b7280;font-size:14px;">Notes</td><td style="padding:8px 16px;font-size:14px;">${data.notes}</td></tr>`
    : "";

  const firstTimeBadge = data.isFirstTime
    ? `<span style="display:inline-block;margin-left:8px;background:#fdf2f8;color:#e879b0;font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;border:1px solid #fbcfe8;">🎀 First Visit</span>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07);">

        <!-- Header -->
        <tr>
          <td style="background:#16a34a;padding:20px 32px;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">
              ✅ New Booking — Deposit Paid via PayPal
            </p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">
              $15 deposit received. Calendar event has been created automatically.
              ${data.paypalOrderId ? `PayPal Order ID: <strong>${data.paypalOrderId}</strong>` : ""}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">

            <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#111827;">📅 Appointment Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dcfce7;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f0fdf4;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #dcfce7;width:130px;">Date</td>
                <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #dcfce7;">${data.date}</td>
              </tr>
              <tr>
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #dcfce7;">Time</td>
                <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #dcfce7;">${data.timeDisplay}</td>
              </tr>
              <tr style="background:#f0fdf4;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #dcfce7;">Service</td>
                <td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #dcfce7;">${data.serviceName} ($${data.servicePrice})</td>
              </tr>
              ${artTierLine}
              ${removalLine}
              ${drinkLine}
              <tr style="background:#f0fdf4;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;">Total Est.</td>
                <td style="padding:8px 16px;font-size:15px;font-weight:700;color:#16a34a;">$${data.total} <span style="font-size:13px;font-weight:400;color:#6b7280;">(deposit $15 paid)</span></td>
              </tr>
            </table>

            <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#111827;">👤 Client Info ${firstTimeBadge}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <tr style="background:#f9fafb;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;width:130px;">Name</td>
                <td style="padding:8px 16px;font-size:14px;font-weight:600;border-bottom:1px solid #e5e7eb;">${data.clientName}</td>
              </tr>
              <tr>
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Phone</td>
                <td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #e5e7eb;"><a href="tel:${data.clientPhone}" style="color:#16a34a;">${data.clientPhone}</a></td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:8px 16px;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Email</td>
                <td style="padding:8px 16px;font-size:14px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${data.clientEmail}" style="color:#16a34a;">${data.clientEmail}</a></td>
              </tr>
              ${instagramLine}
              ${notesLine}
            </table>

          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Cutify Nails booking system — ${ownerEmail}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Cutify Nails Bookings" <${ownerEmail}>`,
    to: ownerEmail,
    subject: `✅ New Booking (PayPal Paid) — ${data.clientName} — ${data.date} ${data.timeDisplay}`,
    html,
  });
}

