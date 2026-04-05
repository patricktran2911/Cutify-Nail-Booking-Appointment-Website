"use client";

import { useState } from "react";
import { useBooking, useBookingDispatch, useBookingTotal } from "./BookingContext";
import { DEPOSIT_AMOUNT } from "@/lib/services";

function PaymentContent() {
  const state = useBooking();
  const dispatch = useBookingDispatch();
  const total = useBookingTotal(state);
  const [manualSent, setManualSent] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const createBooking = async () => {
    setBookingLoading(true);
    setBookingError(null);
    try {
      // Manual payment → send email to owner, no calendar event yet
      const res = await fetch("/api/payment/notify-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: state.selectedService,
          artTier: state.selectedArtTier,
          removal: state.selectedRemoval,
          timeSlot: state.selectedTimeSlot,
          date: state.selectedDate,
          clientInfo: state.clientInfo,
          total,
        }),
      });
      if (!res.ok) throw new Error("Failed to send booking notice");

      dispatch({ type: "SET_PAYMENT_METHOD", payload: "manual" });
      dispatch({ type: "SET_PAYMENT_STATUS", payload: "manual-pending" });
      dispatch({ type: "NEXT_STEP" });
    } catch {
      setBookingError("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-bold text-warm-dark mb-1">
          Appointment Summary
        </h3>
        <p className="text-sm text-warm-gray mb-4">
          Review your selections and pay the $15 deposit
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border-2 border-brand-100/40 p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray">Base Service</span>
          <span className="font-medium text-warm-dark">
            {state.selectedService?.name} — ${state.selectedService?.price}
          </span>
        </div>
        {state.selectedArtTier && (
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray">Nail Art</span>
            <span className="font-medium text-warm-dark">
              Tier {state.selectedArtTier.tier}: {state.selectedArtTier.name} —{" "}
              {state.selectedArtTier.priceLabel}
            </span>
          </div>
        )}
        {state.selectedRemoval && (
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray">Removal</span>
            <span className="font-medium text-warm-dark">
              {state.selectedRemoval.name} — ${state.selectedRemoval.price}
            </span>
          </div>
        )}
        {state.clientInfo.selectedDrink && (
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray">🧋 Drink</span>
            <span className="font-medium text-brand-400">
              {state.clientInfo.selectedDrink.split("::")[1] ?? state.clientInfo.selectedDrink}
            </span>
          </div>
        )}
        <div className="border-t border-brand-50 pt-3 flex justify-between">
          <span className="font-heading font-bold text-warm-dark">
            Estimated Total
          </span>
          <span className="font-heading font-bold text-brand-400 text-lg">
            ${total}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray">Deposit (due now)</span>
          <span className="font-bold text-brand-400">${DEPOSIT_AMOUNT}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray">Remaining (due at appointment)</span>
          <span className="font-medium text-warm-dark">
            ${total - DEPOSIT_AMOUNT}
          </span>
        </div>
      </div>

      {/* Date/Time */}
      <div className="bg-brand-50 rounded-xl p-4 text-sm">
        <p className="text-warm-dark">
          <strong>Date:</strong>{" "}
          {state.selectedDate && new Date(state.selectedDate + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-warm-dark mt-1">
          <strong>Time:</strong> {state.selectedTimeSlot?.display}
        </p>
        <p className="text-warm-dark mt-1">
          <strong>Client:</strong> {state.clientInfo.name}
        </p>
        {state.clientInfo.isFirstTime && (
          <p className="text-brand-400 font-medium mt-1">
            🎀 First-time client — complimentary drink included!
          </p>
        )}
      </div>

      {bookingError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {bookingError}
        </div>
      )}

      {bookingLoading && (
        <div className="text-center py-4">
          <div className="inline-block w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-warm-gray mt-2">Creating your booking...</p>
        </div>
      )}

      {!bookingLoading && (
        <>
          {/* Manual Payment */}
          <div className="bg-white rounded-xl border-2 border-brand-100/40 p-5">
            <h4 className="font-heading font-bold text-warm-dark text-sm mb-3">
              Pay Manually via Zelle / Venmo
            </h4>
            <div className="text-sm text-warm-gray space-y-1.5 mb-4">
              <p>
                <strong className="text-warm-dark">Zelle:</strong> (916)
                918-4493 — Ngan Nguyen
              </p>
              <p>
                <strong className="text-warm-dark">Venmo:</strong> @joziecozie
              </p>
              <p className="text-xs mt-2">
                Send ${DEPOSIT_AMOUNT} and include your name in the memo. Your booking will be confirmed once payment is verified.
              </p>
            </div>
            {!manualSent ? (
              <button
                onClick={() => setManualSent(true)}
                className="w-full py-2.5 bg-brand-50 text-brand-400 font-semibold rounded-full border-2 border-brand-200 hover:bg-brand-100 transition-colors text-sm"
              >
                I&apos;ll Send the Deposit Manually
              </button>
            ) : (
              <button
                onClick={() => createBooking()}
                className="w-full py-2.5 bg-brand-400 text-white font-semibold rounded-full hover:bg-brand-300 transition-colors text-sm"
              >
                Submit Booking Request
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentStep() {
  return <PaymentContent />;
}
