"use client";

import { useState } from "react";
import { useBooking, useBookingDispatch } from "./BookingContext";
import { drinkMenu } from "@/lib/services";

export default function ClientInfoStep() {
  const state = useBooking();
  const dispatch = useBookingDispatch();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const update = (field: string, value: string | boolean) => {
    dispatch({ type: "SET_CLIENT_INFO", payload: { [field]: value } });
  };

  const selectDrink = (drinkId: string, drinkName: string) => {
    const isSame = state.clientInfo.selectedDrink === drinkId;
    dispatch({ type: "SET_DRINK", payload: isSame ? null : drinkId });
    if (!isSame) setOpenCategory(null);
    // store the display name via clientInfo notes isn't right — we use selectedDrink id
    // so we also keep a display-friendly name. We'll encode as "id::name"
    dispatch({
      type: "SET_DRINK",
      payload: isSame ? null : `${drinkId}::${drinkName}`,
    });
  };

  const selectedDrinkLabel = state.clientInfo.selectedDrink
    ? state.clientInfo.selectedDrink.split("::")[1] ?? state.clientInfo.selectedDrink
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-bold text-warm-dark mb-1">
          Your Information
        </h3>
        <p className="text-sm text-warm-gray mb-4">
          So I can confirm your appointment and keep in touch
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-warm-dark mb-1">
            Name <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            value={state.clientInfo.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-2.5 bg-white border-2 border-brand-100/40 rounded-xl text-warm-dark placeholder:text-warm-light focus:border-brand-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-dark mb-1">
            Phone <span className="text-brand-400">*</span>
          </label>
          <input
            type="tel"
            value={state.clientInfo.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-2.5 bg-white border-2 border-brand-100/40 rounded-xl text-warm-dark placeholder:text-warm-light focus:border-brand-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-dark mb-1">
            Instagram Handle{" "}
            <span className="text-warm-light font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={state.clientInfo.instagram}
            onChange={(e) => update("instagram", e.target.value)}
            placeholder="@yourusername"
            className="w-full px-4 py-2.5 bg-white border-2 border-brand-100/40 rounded-xl text-warm-dark placeholder:text-warm-light focus:border-brand-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-dark mb-1">
            Email <span className="text-brand-400">*</span>
          </label>
          <input
            type="email"
            value={state.clientInfo.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 bg-white border-2 border-brand-100/40 rounded-xl text-warm-dark placeholder:text-warm-light focus:border-brand-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-dark mb-1">
            Notes / Inspo Description
          </label>
          <textarea
            value={state.clientInfo.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Describe your dream set, share inspo ideas, or any preferences!"
            rows={3}
            className="w-full px-4 py-2.5 bg-white border-2 border-brand-100/40 rounded-xl text-warm-dark placeholder:text-warm-light focus:border-brand-400 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Drink Menu */}
        <div>
          <label className="block text-sm font-medium text-warm-dark mb-1">
            Choose Your Complimentary Drink ✨
          </label>
          <p className="text-xs text-warm-gray mb-3">
            Pick whatever sounds good — included with every appointment!
          </p>

          {selectedDrinkLabel && (
            <div className="mb-3 flex items-center justify-between px-4 py-2.5 bg-brand-50 border-2 border-brand-400 rounded-xl">
              <span className="text-sm font-semibold text-brand-400">
                ✓ {selectedDrinkLabel}
              </span>
              <button
                onClick={() => dispatch({ type: "SET_DRINK", payload: null })}
                className="text-xs text-warm-gray hover:text-warm-dark transition-colors"
              >
                Change
              </button>
            </div>
          )}

          <div className="space-y-2">
            {drinkMenu.map((category) => {
              const isOpen = openCategory === category.id;
              return (
                <div
                  key={category.id}
                  className="border-2 border-brand-100/40 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() =>
                      setOpenCategory(isOpen ? null : category.id)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-50 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-warm-dark">
                      <span>{category.emoji}</span>
                      {category.name}
                    </span>
                    <svg
                      className={`w-4 h-4 text-warm-gray transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-t border-brand-50 divide-y divide-brand-50">
                      {category.items.map((item) => {
                        const drinkKey = `${item.id}::${item.name}`;
                        const isSelected =
                          state.clientInfo.selectedDrink === drinkKey;
                        return (
                          <button
                            key={item.id}
                            onClick={() => selectDrink(item.id, item.name)}
                            className={`w-full text-left px-5 py-2.5 text-sm transition-colors flex items-center justify-between ${
                              isSelected
                                ? "bg-brand-50 text-brand-400 font-semibold"
                                : "text-warm-gray hover:bg-brand-50 hover:text-warm-dark"
                            }`}
                          >
                            {item.name}
                            {isSelected && (
                              <span className="text-brand-400">♡</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl bg-brand-50 border border-brand-100/40 cursor-pointer">
          <input
            type="checkbox"
            checked={state.clientInfo.isFirstTime}
            onChange={(e) => update("isFirstTime", e.target.checked)}
            className="w-4 h-4 text-brand-400 rounded border-brand-200 focus:ring-brand-400"
          />
          <div>
            <span className="text-sm font-medium text-warm-dark">
              This is my first visit! 🎀
            </span>
            <p className="text-xs text-warm-gray">
              Let me know so I can make it extra special
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
