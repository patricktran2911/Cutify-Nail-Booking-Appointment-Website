"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { BookingState, BookingAction, ClientInfo } from "@/types";

const initialClientInfo: ClientInfo = {
  name: "",
  phone: "",
  instagram: "",
  email: "",
  notes: "",
  isFirstTime: false,
  selectedDrink: null,
};

const initialState: BookingState = {
  step: 1,
  selectedService: null,
  selectedArtTier: null,
  selectedRemoval: null,
  selectedDate: null,
  selectedTimeSlot: null,
  clientInfo: initialClientInfo,
  paymentMethod: null,
  paymentStatus: "pending",
  paypalOrderId: null,
  calendarEventId: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_SERVICE":
      return { ...state, selectedService: action.payload };
    case "SET_ART_TIER":
      return { ...state, selectedArtTier: action.payload };
    case "SET_REMOVAL":
      return { ...state, selectedRemoval: action.payload };
    case "SET_DATE":
      return { ...state, selectedDate: action.payload, selectedTimeSlot: null };
    case "SET_TIME_SLOT":
      return { ...state, selectedTimeSlot: action.payload };
    case "SET_CLIENT_INFO":
      return {
        ...state,
        clientInfo: { ...state.clientInfo, ...action.payload },
      };
    case "SET_DRINK":
      return {
        ...state,
        clientInfo: { ...state.clientInfo, selectedDrink: action.payload },
      };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "SET_PAYMENT_STATUS":
      return { ...state, paymentStatus: action.payload };
    case "SET_PAYPAL_ORDER_ID":
      return { ...state, paypalOrderId: action.payload };
    case "SET_CALENDAR_EVENT_ID":
      return { ...state, calendarEventId: action.payload };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 5) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "GO_TO_STEP":
      return { ...state, step: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext<BookingState>(initialState);
const BookingDispatchContext = createContext<Dispatch<BookingAction>>(() => {});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={state}>
      <BookingDispatchContext.Provider value={dispatch}>
        {children}
      </BookingDispatchContext.Provider>
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}

export function useBookingDispatch() {
  return useContext(BookingDispatchContext);
}

export function useBookingTotal(state: BookingState): number {
  let total = 0;
  if (state.selectedService) total += state.selectedService.price;
  if (state.selectedArtTier) total += state.selectedArtTier.price;
  if (state.selectedRemoval) total += state.selectedRemoval.price;
  return total;
}
