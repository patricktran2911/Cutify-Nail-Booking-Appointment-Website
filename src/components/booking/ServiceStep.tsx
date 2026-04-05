"use client";

import { useBooking, useBookingDispatch } from "./BookingContext";
import { services, artTiers, removalOptions } from "@/lib/services";
import type { Service, ArtTier, RemovalOption } from "@/types";

export default function ServiceStep() {
  const state = useBooking();
  const dispatch = useBookingDispatch();

  const handleServiceSelect = (service: Service) => {
    dispatch({ type: "SET_SERVICE", payload: service });
  };

  const handleArtTierSelect = (tier: ArtTier | null) => {
    dispatch({ type: "SET_ART_TIER", payload: tier });
  };

  const handleRemovalSelect = (removal: RemovalOption | null) => {
    if (state.selectedRemoval?.id === removal?.id) {
      dispatch({ type: "SET_REMOVAL", payload: null });
    } else {
      dispatch({ type: "SET_REMOVAL", payload: removal });
    }
  };

  return (
    <div className="space-y-8">
      {/* Base Service Selection */}
      <div>
        <h3 className="font-heading text-lg font-bold text-warm-dark mb-1">
          Choose Your Base Service
        </h3>
        <p className="text-sm text-warm-gray mb-4">Select one base service</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {services.map((service) => {
            const isSelected = state.selectedService?.id === service.id;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-brand-400 bg-brand-50 shadow-sm"
                    : "border-brand-100/40 bg-white hover:border-brand-200"
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-heading font-bold text-warm-dark text-sm">
                    {service.name}
                  </span>
                  <span className="font-bold text-brand-400 ml-2 shrink-0">
                    ${service.price}
                  </span>
                </div>
                <p className="text-xs text-warm-gray">
                  {service.description[0]}
                </p>
                <p className="text-xs text-warm-light mt-1">
                  ~{service.duration} min
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nail Art Tier */}
      <div>
        <h3 className="font-heading text-lg font-bold text-warm-dark mb-1">
          Add Nail Art
        </h3>
        <p className="text-sm text-warm-gray mb-4">Optional — select a tier</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleArtTierSelect(null)}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              state.selectedArtTier === null
                ? "border-brand-400 bg-brand-50"
                : "border-brand-100/40 bg-white hover:border-brand-200"
            }`}
          >
            <span className="text-sm font-semibold text-warm-dark">None</span>
            <p className="text-xs text-warm-gray mt-0.5">+$0</p>
          </button>
          {artTiers.map((tier) => {
            const isSelected = state.selectedArtTier?.id === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => handleArtTierSelect(tier)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? "border-brand-400 bg-brand-50"
                    : "border-brand-100/40 bg-white hover:border-brand-200"
                }`}
              >
                <span className="text-sm font-semibold text-warm-dark block">
                  T{tier.tier}: {tier.name}
                </span>
                <p className="text-xs text-brand-400 font-bold mt-0.5">
                  {tier.priceLabel}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Removal Add-on */}
      <div>
        <h3 className="font-heading text-lg font-bold text-warm-dark mb-1">
          Need Removal?
        </h3>
        <p className="text-sm text-warm-gray mb-4">
          Optional — if you have existing product on your nails
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {removalOptions.map((removal) => {
            const isSelected = state.selectedRemoval?.id === removal.id;
            return (
              <button
                key={removal.id}
                onClick={() => handleRemovalSelect(removal)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? "border-brand-400 bg-brand-50"
                    : "border-brand-100/40 bg-white hover:border-brand-200"
                }`}
              >
                <span className="text-sm font-semibold text-warm-dark">
                  {removal.name}
                </span>
                <p className="text-xs text-brand-400 font-bold mt-0.5">
                  +${removal.price}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
