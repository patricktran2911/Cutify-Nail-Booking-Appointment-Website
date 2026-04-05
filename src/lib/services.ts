import { Service, ArtTier, RemovalOption, DrinkCategory } from "@/types";

export const services: Service[] = [
  {
    id: "gel-manicure",
    name: "Regular Gel Manicure",
    price: 40,
    description: [
      "Classic gel polish for a clean, glossy look",
      "Best for short to medium nails",
      "Not recommended for long nails due to reduced durability",
    ],
    duration: 60,
  },
  {
    id: "builder-gel",
    name: "Builder Gel / Hard Gel Overlay",
    price: 55,
    description: [
      "Stronger, thicker gel applied over natural nails",
      "Adds durability and strength",
      "Great for clients growing out their nails",
    ],
    duration: 75,
  },
  {
    id: "gel-extensions",
    name: "Gel Extensions",
    price: 65,
    description: [
      "Full-cover tips with soft gel",
      "Adds extra length and more shape variety",
      "Ideal for longer and more detailed nail styles",
      "Can be filled later with hard gel",
    ],
    duration: 90,
  },
  {
    id: "fill",
    name: "Fill for Hard Gel / Gel X",
    price: 55,
    description: [
      "Maintenance option for existing hard gel or Gel X sets",
    ],
    duration: 75,
  },
];

export const artTiers: ArtTier[] = [
  {
    id: "tier-1",
    tier: 1,
    name: "Minimal",
    priceLabel: "+$10",
    price: 10,
    examples: [
      "Simple abstract line work",
      "Full chrome",
      "1–2 charms",
      "French design",
      "Blooming gel",
    ],
  },
  {
    id: "tier-2",
    tier: 2,
    name: "Detailed",
    priceLabel: "+$20",
    price: 20,
    examples: [
      "Deep French",
      "3D nail art",
      "Airbrush",
      "Ombre",
      "Marble",
      "Isolated chrome",
      "Two or more techniques combined",
    ],
  },
  {
    id: "tier-3",
    tier: 3,
    name: "Intricate",
    priceLabel: "+$30+",
    price: 30,
    examples: [
      "Sculpted 3D gel",
      "Molding gel",
      "Clay gel",
      "Complex 3D art",
      "Three or more techniques combined",
    ],
  },
];

export const removalOptions: RemovalOption[] = [
  { id: "foreign-removal", name: "Foreign Removal", price: 15 },
  { id: "gelx-removal", name: "Gel X / Hard Gel Removal", price: 10 },
  { id: "gel-removal", name: "Gel Removal", price: 5 },
];

export const DEPOSIT_AMOUNT = 15;

export const BUSINESS_HOURS = {
  start: 10, // 10 AM
  end: 18, // 6 PM
};

export const drinkMenu: DrinkCategory[] = [
  {
    id: "coffee",
    name: "Coffee",
    emoji: "☕",
    items: [
      { id: "salted-vietnamese", name: "Salted Vietnamese" },
      { id: "marble-latte", name: "Marble Latte" },
      { id: "classic-vietnamese", name: "Classic Vietnamese" },
    ],
  },
  {
    id: "matcha",
    name: "Matcha",
    emoji: "🍵",
    items: [
      { id: "classic-matcha-latte", name: "Classic Matcha Latte" },
      { id: "cookie-butter-latte", name: "Cookie Butter Latte" },
      { id: "salted-maple-latte", name: "Salted Maple Latte" },
    ],
  },
  {
    id: "milk-tea",
    name: "Milk Tea",
    emoji: "🧋",
    items: [
      { id: "roasted-assam-milk-tea", name: "Roasted Assam Milk Tea" },
      { id: "roasted-oolong-milk-tea", name: "Roasted Oolong Milk Tea" },
      { id: "jasmine-green-milk-tea", name: "Jasmine Green Milk Tea" },
    ],
  },
  {
    id: "cloud-tea",
    name: "Cloud Tea",
    emoji: "☁️",
    items: [
      { id: "assam-black-tea", name: "Assam Black Tea" },
      { id: "roasted-oolong-tea", name: "Roasted Oolong Tea" },
      { id: "jasmine-green-tea", name: "Jasmine Green Tea" },
    ],
  },
  {
    id: "refreshing",
    name: "Refreshing",
    emoji: "🍓",
    items: [
      { id: "strawberry-green-tea", name: "Strawberry Green Tea" },
      { id: "strawberry-swirl", name: "Strawberry Swirl" },
    ],
  },
];
