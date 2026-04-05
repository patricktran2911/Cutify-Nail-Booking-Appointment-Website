"use client";

import { useState, useEffect, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TIERS = [
  { tier: 1, label: "Tier 1 — Minimal", priceLabel: "+$10" },
  { tier: 2, label: "Tier 2 — Detailed", priceLabel: "+$20" },
  { tier: 3, label: "Tier 3 — Intricate", priceLabel: "+$30+" },
];

interface TierImages {
  [tier: number]: string[];
}

export default function AdminPage() {
  const router = useRouter();
  const [images, setImages] = useState<TierImages>({ 1: [], 2: [], 3: [] });
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [dragOver, setDragOver] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchAllImages();
  }, []);

  async function fetchAllImages() {
    const results = await Promise.all(
      TIERS.map(async ({ tier }) => {
        const res = await fetch(`/api/admin/images?tier=${tier}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return { tier, images: [] };
        }
        const data = await res.json();
        return { tier, images: data.images as string[] };
      })
    );
    const next: TierImages = { 1: [], 2: [], 3: [] };
    results.forEach(({ tier, images: imgs }) => {
      next[tier] = imgs;
    });
    setImages(next);
  }

  async function uploadFiles(tier: number, files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading((prev) => ({ ...prev, [tier]: true }));
    setError(null);

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("tier", String(tier));
      formData.append("file", file);

      const res = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(`Upload failed: ${data.error}`);
      }
    }

    setUploading((prev) => ({ ...prev, [tier]: false }));
    // Re-fetch to get updated list with sanitized filenames
    const res = await fetch(`/api/admin/images?tier=${tier}`);
    const data = await res.json();
    setImages((prev) => ({ ...prev, [tier]: data.images }));
  }

  async function deleteImage(tier: number, filename: string) {
    if (!confirm(`Delete "${filename}"?`)) return;

    const res = await fetch(
      `/api/admin/images?tier=${tier}&filename=${encodeURIComponent(filename)}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setImages((prev) => ({
        ...prev,
        [tier]: prev[tier].filter((f) => f !== filename),
      }));
    } else {
      const data = await res.json();
      setError(`Delete failed: ${data.error}`);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function onDrop(tier: number, e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [tier]: false }));
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(tier, e.dataTransfer.files);
    }
  }

  function onFileChange(tier: number, e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(tier, e.target.files);
      e.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-milky">
      {/* Header */}
      <header className="bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="font-heading text-xl font-bold text-warm-dark">
            Gallery Manager
          </h1>
          <p className="text-warm-gray text-xs">Cutify Nails — Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="text-xs text-brand-400 hover:underline"
          >
            View site →
          </a>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TIERS.map(({ tier, label, priceLabel }) => (
            <div key={tier} className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
              {/* Tier header */}
              <div className="bg-brand-50 px-5 py-4 border-b border-brand-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-warm-dark text-base">
                    {label}
                  </h2>
                  <span className="text-xs font-bold text-brand-400 bg-white border border-brand-200 rounded-full px-2.5 py-1">
                    {priceLabel}
                  </span>
                </div>
                <p className="text-xs text-warm-gray mt-1">
                  {images[tier].length} image{images[tier].length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Image grid */}
              <div className="p-4">
                {images[tier].length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {images[tier].map((filename) => (
                      <div
                        key={filename}
                        className="relative aspect-square rounded-xl overflow-hidden group"
                      >
                        <Image
                          src={`/assets/Tier_${tier}/${filename}`}
                          alt={filename}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                        {/* Delete overlay */}
                        <button
                          onClick={() => deleteImage(tier, filename)}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                          title="Delete image"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
                            ×
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-warm-gray text-sm py-6">
                    No images yet
                  </p>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver((prev) => ({ ...prev, [tier]: true }));
                  }}
                  onDragLeave={() =>
                    setDragOver((prev) => ({ ...prev, [tier]: false }))
                  }
                  onDrop={(e) => onDrop(tier, e)}
                  onClick={() => fileInputRefs.current[tier]?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                    dragOver[tier]
                      ? "border-brand-400 bg-brand-50"
                      : "border-brand-200 hover:border-brand-400 hover:bg-brand-50"
                  }`}
                >
                  {uploading[tier] ? (
                    <p className="text-brand-400 text-sm font-medium animate-pulse">
                      Uploading…
                    </p>
                  ) : (
                    <>
                      <p className="text-warm-gray text-sm">
                        {dragOver[tier]
                          ? "Drop to upload"
                          : "Drag & drop images here"}
                      </p>
                      <p className="text-brand-400 text-xs mt-1 font-medium">
                        or click to browse
                      </p>
                      <p className="text-warm-gray/60 text-xs mt-1">
                        JPEG, PNG, WebP, GIF · max 10 MB
                      </p>
                    </>
                  )}
                </div>

                <input
                  ref={(el) => { fileInputRefs.current[tier] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => onFileChange(tier, e)}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
