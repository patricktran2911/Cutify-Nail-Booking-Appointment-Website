"use client";

import { useState, useEffect, useRef, DragEvent, ChangeEvent, memo } from "react";

interface TierCardProps {
  tier: number;
  label: string;
  priceLabel: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  onError: (msg: string) => void;
}

const TierCard = memo(function TierCard({
  tier,
  label,
  priceLabel,
  images,
  onImagesChange,
  onError,
}: TierCardProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);

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
        onError(`Upload failed: ${data.error}`);
      }
    }

    setUploading(false);
    const res = await fetch(`/api/admin/images?tier=${tier}`);
    const data = await res.json();
    onImagesChange(data.images);
  }

  async function deleteImage(filename: string) {
    if (!confirm(`Delete "${filename}"?`)) return;

    const res = await fetch(
      `/api/admin/images?tier=${tier}&filename=${encodeURIComponent(filename)}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      onImagesChange(images.filter((f) => f !== filename));
    } else {
      const data = await res.json();
      onError(`Delete failed: ${data.error}`);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
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
          {images.length} image{images.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="p-4">
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {images.map((filename) => (
              <div
                key={filename}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img
                  src={`/assets/Tier_${tier}/${filename}`}
                  alt={filename}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  onClick={() => deleteImage(filename)}
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
          <p className="text-center text-warm-gray text-sm py-6">No images yet</p>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-brand-400 bg-brand-50"
              : "border-brand-200 hover:border-brand-400 hover:bg-brand-50"
          }`}
        >
          {uploading ? (
            <p className="text-brand-400 text-sm font-medium animate-pulse">
              Uploading…
            </p>
          ) : (
            <>
              <p className="text-warm-gray text-sm">
                {dragOver ? "Drop to upload" : "Drag & drop images here"}
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
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
});

const TIERS = [
  { tier: 1, label: "Tier 1 — Minimal", priceLabel: "+$10" },
  { tier: 2, label: "Tier 2 — Detailed", priceLabel: "+$20" },
  { tier: 3, label: "Tier 3 — Intricate", priceLabel: "+$30+" },
];

interface GalleryTabProps {
  onAuthError: () => void;
  onError: (msg: string) => void;
}

export default function GalleryTab({ onAuthError, onError }: GalleryTabProps) {
  const [images, setImages] = useState<Record<number, string[]>>({ 1: [], 2: [], 3: [] });

  useEffect(() => {
    Promise.all(
      TIERS.map(async ({ tier }) => {
        const res = await fetch(`/api/admin/images?tier=${tier}`);
        if (res.status === 401) {
          onAuthError();
          return { tier, imgs: [] as string[] };
        }
        const data = await res.json();
        return { tier, imgs: data.images as string[] };
      })
    ).then((results) => {
      const next: Record<number, string[]> = { 1: [], 2: [], 3: [] };
      results.forEach(({ tier, imgs }) => { next[tier] = imgs; });
      setImages(next);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {TIERS.map(({ tier, label, priceLabel }) => (
        <TierCard
          key={tier}
          tier={tier}
          label={label}
          priceLabel={priceLabel}
          images={images[tier]}
          onImagesChange={(imgs) => setImages((prev) => ({ ...prev, [tier]: imgs }))}
          onError={onError}
        />
      ))}
    </div>
  );
}
