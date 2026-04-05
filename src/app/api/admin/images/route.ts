import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/i;
const VALID_TIERS = ["1", "2", "3"];

export async function GET(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get("tier");

  if (!tier || !VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "assets", `Tier_${tier}`);
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => ALLOWED_EXTENSIONS.test(f))
      .sort();
    return NextResponse.json({ images: files });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function DELETE(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get("tier");
  const filename = request.nextUrl.searchParams.get("filename");

  if (!tier || !VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  if (!filename || !ALLOWED_EXTENSIONS.test(filename) || filename.includes("/") || filename.includes("\\")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "assets",
    `Tier_${tier}`,
    path.basename(filename)
  );

  // Ensure the resolved path stays inside the expected directory
  const expectedDir = path.join(process.cwd(), "public", "assets", `Tier_${tier}`);
  if (!filePath.startsWith(expectedDir + path.sep) && filePath !== expectedDir) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
