"use client";

import { useBooking, useBookingDispatch, useBookingTotal } from "./BookingContext";
import { DEPOSIT_AMOUNT } from "@/lib/services";

export default function Confirmation() {
  const state = useBooking();
  const dispatch = useBookingDispatch();
  const total = useBookingTotal(state);

  const isPaid = state.paymentStatus === "completed";

  return (
    <div className="text-center space-y-6">
      <div>
        <span className="text-5xl block mb-4">
          {isPaid ? "🎉" : "📋"}
        </span>
        <h3 className="font-heading text-2xl font-bold text-warm-dark mb-2">
          {isPaid ? "You're All Booked!" : "Almost There!"}
        </h3>
        <p className="text-warm-gray max-w-md mx-auto">
          {isPaid
            ? "Your appointment is confirmed and your deposit has been received. I can't wait to see you!"
            : "Your appointment is reserved. Please send your $15 deposit within 20 minutes to confirm."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-brand-100/40 p-6 text-left max-w-md mx-auto space-y-3">
        <h4 className="font-heading font-bold text-warm-dark text-center mb-3">
          Appointment Details
        </h4>
        <div className="text-sm space-y-2">
          <p>
            <span className="text-warm-gray">Service:</span>{" "}
            <strong className="text-warm-dark">
              {state.selectedService?.name}
            </strong>
          </p>
          {state.selectedArtTier && (
            <p>
              <span className="text-warm-gray">Nail Art:</span>{" "}
              <strong className="text-warm-dark">
                Tier {state.selectedArtTier.tier} — {state.selectedArtTier.name}
              </strong>
            </p>
          )}
          {state.selectedRemoval && (
            <p>
              <span className="text-warm-gray">Removal:</span>{" "}
              <strong className="text-warm-dark">
                {state.selectedRemoval.name}
              </strong>
            </p>
          )}
          {state.clientInfo.selectedDrink && (
            <p>
              <span className="text-warm-gray">Drink:</span>{" "}
              <strong className="text-warm-dark">
                {state.clientInfo.selectedDrink.split("::")[1] ?? state.clientInfo.selectedDrink}
              </strong>
            </p>
          )}
          <div className="border-t border-brand-50 pt-2">
            <p>
              <span className="text-warm-gray">Date:</span>{" "}
              <strong className="text-warm-dark">
                {state.selectedDate &&
                  new Date(state.selectedDate + "T12:00:00").toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
              </strong>
            </p>
            <p>
              <span className="text-warm-gray">Time:</span>{" "}
              <strong className="text-warm-dark">
                {state.selectedTimeSlot?.display}
              </strong>
            </p>
          </div>
          <div className="border-t border-brand-50 pt-2">
            <p>
              <span className="text-warm-gray">Total:</span>{" "}
              <strong className="text-brand-400">${total}</strong>
            </p>
            <p>
              <span className="text-warm-gray">Deposit:</span>{" "}
              <strong className={isPaid ? "text-green-600" : "text-amber-600"}>
                ${DEPOSIT_AMOUNT} {isPaid ? "✓ Paid" : "— Pending"}
              </strong>
            </p>
            <p>
              <span className="text-warm-gray">Due at appointment:</span>{" "}
              <strong className="text-warm-dark">
                ${total - DEPOSIT_AMOUNT}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {!isPaid && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto text-left">
          <p className="text-sm text-amber-800 font-medium mb-2">
            Send your deposit within 20 minutes:
          </p>
          <p className="text-sm text-amber-700">
            Zelle: <strong>(916) 918-4493</strong> — Ngan Nguyen
          </p>
          <p className="text-sm text-amber-700">
            Venmo: <strong>@joziecozie</strong>
          </p>
          <p className="text-xs text-amber-600 mt-2">
            Send a screenshot to @cutify_nails on Instagram or text (916)
            918-4493
          </p>
        </div>
      )}

      <div className="space-y-3 max-w-md mx-auto">
        {state.clientInfo.selectedDrink && (
          <div className="bg-brand-50 rounded-xl p-3 text-sm text-brand-400 font-medium flex items-center gap-2">
            <span>🧋</span>
            <span>Your drink: <strong>{state.clientInfo.selectedDrink.split("::")[1] ?? state.clientInfo.selectedDrink}</strong> — see you soon!</span>
          </div>
        )}
        {state.clientInfo.isFirstTime && (
          <div className="bg-brand-50 rounded-xl p-3 text-sm text-brand-400 font-medium">
            🎀 Welcome, first-timer! So excited to meet you!
          </div>
        )}

        <div className="bg-brand-50 rounded-xl p-3 text-sm text-warm-gray">
          <p className="font-medium text-warm-dark mb-1">Quick reminders:</p>
          <ul className="space-y-1 text-xs">
            <li>♡ Arrive with bare nails (no acrylic)</li>
            <li>♡ 24-hour notice for cancellations/reschedules</li>
            <li>♡ 15+ minutes late may count as a no-show</li>
          </ul>
        </div>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="w-full py-2.5 bg-white text-brand-400 font-semibold rounded-full border-2 border-brand-200 hover:bg-brand-50 transition-colors text-sm"
        >
          Book Another Appointment
        </button>
      </div>
    </div>
  );
}
