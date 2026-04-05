import fs from "fs";
import path from "path";
import { galleryData, GalleryTier, GalleryImage } from "@/lib/gallery";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Server-only: reads actual files from public/assets/Tier_X at request time. */
export function getDynamicGalleryData(): GalleryTier[] {
  return galleryData.map((tier) => {
    const dir = path.join(process.cwd(), "public", "assets", `Tier_${tier.tier}`);
    let images: GalleryImage[] = tier.images;
    try {
      const files = fs.readdirSync(dir).filter((f) => IMAGE_EXT.test(f)).sort();
      if (files.length > 0) {
        images = files.map((f) => ({
          src: `/assets/Tier_${tier.tier}/${f}`,
          alt: `Tier ${tier.tier} nail art example`,
        }));
      }
    } catch {
      // directory missing — fall back to static data
    }
    return { ...tier, images };
  });
}
