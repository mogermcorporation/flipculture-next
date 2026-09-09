import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flip Culture | Curated Tech, Gaming, Streetwear & Everyday Deals",
  description:
    "Discover real-time verified active marketplace drops for deadstock sneakers, high-spec gaming laptops, retro tech, and rare streetwear grails.",
  authors: [{ name: "Flip Culture" }],
  keywords: [
    "Flip Culture",
    "Air Jordans",
    "Sneaker Resale",
    "Gaming Laptops",
    "Streetwear Grails",
    "Yeezy Drops",
    "ROG Zephyrus",
    "Steam Deck OLED"
  ],
  openGraph: {
    title: "Flip Culture | Curated Tech, Gaming & Streetwear",
    description: "Curated active drops for Jordans, Yeezys, ROG Gaming Laptops, and handheld gaming rigs.",
    url: "https://flipculture.netlify.app",
    siteName: "Flip Culture",
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-neutral-950 text-white antialiased">{children}</body>
    </html>
  );
}
