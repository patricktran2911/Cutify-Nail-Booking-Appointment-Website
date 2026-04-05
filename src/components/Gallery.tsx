"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryData, GalleryTier } from "@/lib/gallery";
import GalleryLightbox from "@/components/GalleryLightbox";

interface Props {
  tiers?: GalleryTier[];
}

export default function Gallery({ tiers }: Props) {
  const data = tiers ?? galleryData;
  const [activeTier, setActiveTier] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tier = data[activeTier];
  const images = tier.images;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : 0));
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? Math.min(i + 1, images.length - 1) : 0));

  return (
    <section id="gallery" className="py-20 bg-milky">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-2">
            Our Work
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-warm-dark mb-3">
            Nail Art Gallery
          </h2>
          <p className="text-warm-gray max-w-xl mx-auto text-sm md:text-base">
            Browse examples by art tier. Click any photo to view it full screen.
          </p>
        </div>

        {/* Tier tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {data.map((t, i) => (
            <button
              key={t.tier}
              onClick={() => setActiveTier(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeTier === i
                  ? "bg-brand-400 text-white border-brand-400 shadow-md"
                  : "bg-white text-warm-gray border-brand-200 hover:border-brand-400 hover:text-brand-400"
              }`}
            >
              Tier {t.tier} — {t.label}
              <span
                className={`ml-2 text-xs font-bold ${
                  activeTier === i ? "text-white/80" : "text-brand-400"
                }`}
              >
                {t.priceLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Tier description */}
        <p className="text-center text-warm-gray text-sm mb-8 italic">
          {tier.description}
        </p>

        {/* Image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => openLightbox(i)}
              className="relative aspect-square overflow-hidden rounded-2xl group shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 rounded-2xl flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#booking"
            className="inline-block bg-brand-400 hover:bg-brand-300 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-colors"
          >
            Book This Look
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </section>
  );
}
