"use client";

import {
  BookingProvider,
  useBooking,
  useBookingDispatch,
  useBookingTotal,
} from "./booking/BookingContext";
import ServiceStep from "./booking/ServiceStep";
import DateTimeStep from "./booking/DateTimeStep";
import ClientInfoStep from "./booking/ClientInfoStep";
import PaymentStep from "./booking/PaymentStep";
import Confirmation from "./booking/Confirmation";

const steps = [
  { num: 1, label: "Services" },
  { num: 2, label: "Date & Time" },
  { num: 3, label: "Your Info" },
  { num: 4, label: "Payment" },
];

function WizardContent() {
  const state = useBooking();
  const dispatch = useBookingDispatch();
  const total = useBookingTotal(state);

  const canProceed = () => {
    switch (state.step) {
      case 1:
        return state.selectedService !== null;
      case 2:
        return state.selectedDate !== null && state.selectedTimeSlot !== null;
      case 3:
        return (
          state.clientInfo.name.trim() !== "" &&
          state.clientInfo.phone.trim() !== "" &&
          state.clientInfo.email.trim() !== ""
        );
      default:
        return false;
    }
  };

  if (state.step === 5) {
    return <Confirmation />;
  }

  return (
    <div>
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  state.step >= s.num
                    ? "bg-brand-400 text-white"
                    : "bg-brand-100 text-warm-gray"
                }`}
              >
                {state.step > s.num ? "✓" : s.num}
              </div>
              <span
                className={`text-xs mt-1 hidden sm:block ${
                  state.step >= s.num ? "text-brand-400 font-medium" : "text-warm-light"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  state.step > s.num ? "bg-brand-400" : "bg-brand-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Running Total */}
      {state.selectedService && (
        <div className="mb-6 flex items-center justify-between bg-brand-50 rounded-xl px-4 py-3">
          <span className="text-sm text-warm-gray">Estimated Total</span>
          <span className="font-heading text-xl font-bold text-brand-400">
            ${total}
          </span>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-75">
        {state.step === 1 && <ServiceStep />}
        {state.step === 2 && <DateTimeStep />}
        {state.step === 3 && <ClientInfoStep />}
        {state.step === 4 && <PaymentStep />}
      </div>

      {/* Navigation */}
      {state.step < 4 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-50">
          <button
            onClick={() => dispatch({ type: "PREV_STEP" })}
            disabled={state.step === 1}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              state.step === 1
                ? "text-warm-light cursor-not-allowed"
                : "text-brand-400 border-2 border-brand-200 hover:bg-brand-50"
            }`}
          >
            Back
          </button>
          <button
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            disabled={!canProceed()}
            className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
              canProceed()
                ? "bg-brand-400 text-white hover:bg-brand-300 shadow-sm"
                : "bg-brand-100 text-warm-light cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {state.step === 4 && (
        <div className="mt-8 pt-6 border-t border-brand-50">
          <button
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-brand-400 border-2 border-brand-200 hover:bg-brand-50 transition-colors"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

export default function BookingWizard() {
  return (
    <section id="booking" className="py-20 bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Ready?
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-warm-dark">
            Book Your Appointment
          </h2>
          <p className="mt-3 text-warm-gray max-w-lg mx-auto">
            Select your services, pick a time, and secure your spot with a $15
            deposit.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100/40 p-6 sm:p-8">
          <BookingProvider>
            <WizardContent />
          </BookingProvider>
        </div>
      </div>
    </section>
  );
}
