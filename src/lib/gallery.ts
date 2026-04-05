export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryTier {
  tier: number;
  label: string;
  priceLabel: string;
  description: string;
  images: GalleryImage[];
}

export const galleryData: GalleryTier[] = [
  {
    tier: 1,
    label: "Minimal",
    priceLabel: "+$10",
    description: "Clean, simple designs — chrome, French, line work, charms, blooming gel.",
    images: [
      { src: "/assets/Tier_1/IMG_1053.jpeg", alt: "Tier 1 nail art example" },
      { src: "/assets/Tier_1/IMG_2200.jpeg", alt: "Tier 1 nail art example" },
      { src: "/assets/Tier_1/IMG_2470.jpg",  alt: "Tier 1 nail art example" },
      { src: "/assets/Tier_1/IMG_2639.jpg",  alt: "Tier 1 nail art example" },
    ],
  },
  {
    tier: 2,
    label: "Detailed",
    priceLabel: "+$20",
    description: "More intricate work — ombre, marble, 3D art, airbrush, deep French, combined techniques.",
    images: [
      { src: "/assets/Tier_2/IMG_2981.jpeg", alt: "Tier 2 nail art example" },
      { src: "/assets/Tier_2/IMG_3087.jpeg", alt: "Tier 2 nail art example" },
      { src: "/assets/Tier_2/IMG_3300.jpeg", alt: "Tier 2 nail art example" },
      { src: "/assets/Tier_2/IMG_3628.jpeg", alt: "Tier 2 nail art example" },
      { src: "/assets/Tier_2/IMG_9839.jpg",  alt: "Tier 2 nail art example" },
      { src: "/assets/Tier_2/IMG_9844.jpg",  alt: "Tier 2 nail art example" },
    ],
  },
  {
    tier: 3,
    label: "Intricate",
    priceLabel: "+$30+",
    description: "High-detail custom art — sculpted 3D gel, molding gel, clay gel, complex multi-technique sets.",
    images: [
      { src: "/assets/Tier_3/IMG_1178.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_1748.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_1833.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_2037.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_2083.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_2708.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_3077.jpg",  alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_3221.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_3223.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_3948.jpeg", alt: "Tier 3 nail art example" },
      { src: "/assets/Tier_3/IMG_8535.jpg",  alt: "Tier 3 nail art example" },
    ],
  },
];
