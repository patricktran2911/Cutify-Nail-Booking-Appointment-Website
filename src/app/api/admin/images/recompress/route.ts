import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const TIERS = ["1", "2", "3"];
const IMAGE_RE = /\.(jpe?g|png|webp|gif)$/i;

export async function POST() {
  let processed = 0;
  let skipped = 0;

  for (const tier of TIERS) {
    const dir = path.join(process.cwd(), "public", "assets", `Tier_${tier}`);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => IMAGE_RE.test(f));

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // Skip files already under 500KB (likely already compressed)
      const ext = path.extname(file).toLowerCase();
      if (ext === ".webp" && stat.size < 500 * 1024) {
        skipped++;
        continue;
      }

      try {
        const buffer = fs.readFileSync(filePath);
        const compressed = await sharp(buffer)
          .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        // Save as .webp
        const baseName = path.basename(file, ext);
        const newPath = path.join(dir, `${baseName}.webp`);
        fs.writeFileSync(newPath, compressed);

        // Remove the original if it wasn't already .webp
        if (ext !== ".webp") {
          fs.unlinkSync(filePath);
        }

        processed++;
      } catch {
        skipped++;
      }
    }
  }

  return NextResponse.json({ ok: true, processed, skipped });
}
