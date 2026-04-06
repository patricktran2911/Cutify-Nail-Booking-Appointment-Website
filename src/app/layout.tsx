import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Cutify Nails — Cute Nail Art in San Marcos, CA",
  description:
    "Licensed nail artist specializing in advanced nail art and cutesy Asian nail art. Book your appointment today!",
  openGraph: {
    title: "Cutify Nails — Cute Nail Art in San Marcos, CA",
    description:
      "Licensed nail artist specializing in advanced nail art and cutesy Asian nail art. Book your appointment today!",
    type: "website",
    locale: "en_US",
    images: {
      url: "/og-image.jpeg",
      width: 1200,
      height: 630,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Cutify Nails — Cute Nail Art in San Marcos, CA",
    description:
      "Licensed nail artist specializing in advanced nail art and cutesy Asian nail art. Book your appointment today!",
    images: ["/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
