"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery";

interface Props {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function GalleryLightbox({ images, index, onClose, onPrev, onNext }: Props) {
  const image = images[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Content — stop propagation so clicking inside doesn't close */}
      <div
        className="relative flex items-center justify-center w-full h-full px-14"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close image"
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 bg-black/40 hover:bg-black/60 rounded-full p-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          aria-label="Previous image"
          disabled={index === 0}
          className="absolute left-2 text-white/80 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-full p-3 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full max-w-3xl max-h-[85vh] aspect-auto flex items-center justify-center">
          <Image
            src={image.src}
            alt={image.alt}
            width={1200}
            height={900}
            className="object-contain max-h-[85vh] rounded-xl shadow-2xl"
            priority
          />
        </div>

        {/* Next */}
        <button
          onClick={onNext}
          aria-label="Next image"
          disabled={index === images.length - 1}
          className="absolute right-2 text-white/80 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-full p-3 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter */}
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm tabular-nums">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
