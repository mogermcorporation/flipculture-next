import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flip Culture | Sneakers, Streetwear, Collectibles & Watches",
  description:
    "Live marketplace bins for athletic sneakers, streetwear, sports cards & memorabilia, and watches. Dual grid: Rarest Grails vs Lowest BIN Deals.",
  authors: [{ name: "Flip Culture" }],
  keywords: [
    "Flip Culture",
    "Air Jordans",
    "Sneaker Resale",
    "Streetwear",
    "Sports Cards",
    "Rolex",
    "Patek Philippe",
    "Audemars Piguet",
    "Yeezy"
  ],
  openGraph: {
    title: "Flip Culture | Sneakers, Streetwear, Collectibles & Watches",
    description: "Curated active drops for Jordans, streetwear, collectibles, and watches.",
    url: "https://flipcultureusa.vercel.app",
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
