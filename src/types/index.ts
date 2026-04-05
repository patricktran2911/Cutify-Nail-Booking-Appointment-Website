export interface Service {
  id: string;
  name: string;
  price: number;
  description: string[];
  duration: number; // minutes
}

export interface ArtTier {
  id: string;
  tier: number;
  name: string;
  priceLabel: string;
  price: number;
  examples: string[];
}

export interface RemovalOption {
  id: string;
  name: string;
  price: number;
}

export interface DrinkItem {
  id: string;
  name: string;
}

export interface DrinkCategory {
  id: string;
  name: string;
  emoji: string;
  items: DrinkItem[];
}

export interface TimeSlot {
  start: string; // ISO string
  end: string; // ISO string
  display: string; // e.g., "10:00 AM"
}

export interface ClientInfo {
  name: string;
  phone: string;
  instagram: string;
  email: string;
  notes: string;
  isFirstTime: boolean;
  selectedDrink: string | null;
}

export type PaymentMethod = "paypal" | "manual" | null;
export type PaymentStatus = "pending" | "completed" | "manual-pending";

export interface BookingState {
  step: number;
  selectedService: Service | null;
  selectedArtTier: ArtTier | null;
  selectedRemoval: RemovalOption | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  clientInfo: ClientInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paypalOrderId: string | null;
  calendarEventId: string | null;
}

export type BookingAction =
  | { type: "SET_SERVICE"; payload: Service | null }
  | { type: "SET_ART_TIER"; payload: ArtTier | null }
  | { type: "SET_REMOVAL"; payload: RemovalOption | null }
  | { type: "SET_DATE"; payload: string | null }
  | { type: "SET_TIME_SLOT"; payload: TimeSlot | null }
  | { type: "SET_CLIENT_INFO"; payload: Partial<ClientInfo> }
  | { type: "SET_DRINK"; payload: string | null }
  | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "SET_PAYMENT_STATUS"; payload: PaymentStatus }
  | { type: "SET_PAYPAL_ORDER_ID"; payload: string | null }
  | { type: "SET_CALENDAR_EVENT_ID"; payload: string | null }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "RESET" };
