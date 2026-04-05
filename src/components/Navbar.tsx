"use client";

import { useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Nail Art", href: "#nail-art" },
  { label: "Policies", href: "#policies" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-milky/80 backdrop-blur-md border-b border-brand-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a
          href="#"
          className="font-heading text-2xl font-bold text-brand-400 tracking-tight"
        >
          Cutify Nails
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-warm-dark hover:text-brand-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className="px-5 py-2 bg-brand-400 text-white text-sm font-semibold rounded-full hover:bg-brand-300 transition-colors shadow-sm"
          >
            Book Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-warm-dark"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-milky border-t border-brand-100/50 px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-warm-dark hover:text-brand-400 transition-colors border-b border-brand-50"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="block mt-3 text-center px-5 py-2.5 bg-brand-400 text-white text-sm font-semibold rounded-full hover:bg-brand-300 transition-colors"
          >
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
}
