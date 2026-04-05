import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const VALID_TIERS = ["1", "2", "3"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tier = formData.get("tier") as string;
  const file = formData.get("file") as File | null;

  if (!tier || !VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, or GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 10 MB limit" },
      { status: 400 }
    );
  }

  // Sanitize filename: keep only safe characters
  const ext = path.extname(file.name).toLowerCase();
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeFilename = `${baseName}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "assets", `Tier_${tier}`);
  fs.mkdirSync(uploadDir, { recursive: true });

  const destPath = path.join(uploadDir, safeFilename);

  // Ensure the resolved path stays within the upload directory
  if (!destPath.startsWith(uploadDir + path.sep) && destPath !== uploadDir) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(bytes));

  return NextResponse.json({
    ok: true,
    filename: safeFilename,
    src: `/assets/Tier_${tier}/${safeFilename}`,
  });
}
