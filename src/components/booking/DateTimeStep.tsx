"use client";

import { useState, useEffect, useCallback } from "react";
import { useBooking, useBookingDispatch } from "./BookingContext";
import type { TimeSlot } from "@/types";

function getNextDays(count: number): string[] {
  const days: string[] = [];
  const today = new Date();
  // Start from tomorrow
  for (let i = 1; days.length < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DateTimeStep() {
  const state = useBooking();
  const dispatch = useBookingDispatch();
  const [dates] = useState(() => getNextDays(14));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duration = state.selectedService?.duration ?? 60;

  const fetchSlots = useCallback(
    async (date: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/calendar/availability?date=${date}&duration=${duration}`
        );
        if (!res.ok) throw new Error("Failed to load availability");
        const data = await res.json();
        setSlots(data.slots ?? []);
      } catch {
        setError("Could not load available times. Please try again.");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [duration]
  );

  useEffect(() => {
    if (state.selectedDate) {
      fetchSlots(state.selectedDate);
    }
  }, [state.selectedDate, fetchSlots]);

  const handleDateSelect = (date: string) => {
    dispatch({ type: "SET_DATE", payload: date });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    dispatch({ type: "SET_TIME_SLOT", payload: slot });
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="font-heading text-lg font-bold text-warm-dark mb-1">
          Pick a Date
        </h3>
        <p className="text-sm text-warm-gray mb-4">
          Select a date to see available time slots
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {dates.map((date) => {
            const isSelected = state.selectedDate === date;
            const d = new Date(date + "T12:00:00");
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = d.getDate();
            const month = d.toLocaleDateString("en-US", { month: "short" });
            return (
              <button
                key={date}
                onClick={() => handleDateSelect(date)}
                className={`shrink-0 w-16 py-3 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? "border-brand-400 bg-brand-50"
                    : "border-brand-100/40 bg-white hover:border-brand-200"
                }`}
              >
                <span className="text-xs text-warm-gray block">{dayName}</span>
                <span className="text-lg font-bold text-warm-dark block">
                  {dayNum}
                </span>
                <span className="text-xs text-warm-gray block">{month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {state.selectedDate && (
        <div>
          <h3 className="font-heading text-lg font-bold text-warm-dark mb-1">
            Available Times
          </h3>
          <p className="text-sm text-warm-gray mb-4">
            {formatDate(state.selectedDate)} &middot; ~{duration} min appointment
          </p>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-warm-gray mt-2">
                Loading available times...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={() => fetchSlots(state.selectedDate!)}
                className="mt-2 text-sm text-brand-400 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && slots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-warm-gray">
                No available times for this date. Please try another day.
              </p>
            </div>
          )}

          {!loading && !error && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => {
                const isSelected = state.selectedTimeSlot?.start === slot.start;
                return (
                  <button
                    key={slot.start}
                    onClick={() => handleSlotSelect(slot)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-brand-400 bg-brand-50 text-brand-400"
                        : "border-brand-100/40 bg-white text-warm-dark hover:border-brand-200"
                    }`}
                  >
                    {slot.display}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
