import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_DESC, DEFAULT_TITLE, organizationLd, pageMeta } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    image: "/logo.png",
    imageAlt: "Flip Culture"
  }),
  metadataBase: new URL("https://flipcultureusa.vercel.app"),
  authors: [{ name: "Flip Culture" }],
  keywords: [
    "Flip Culture",
    "Air Jordans",
    "Sneaker Resale",
    "Streetwear",
    "Denim",
    "Sports Cards",
    "Rolex",
    "Patek Philippe",
    "Audemars Piguet",
    "Yeezy"
  ],
  robots: { index: true, follow: true },
  other: { "p:domain_verify": "f3dd95d73b9d9d5265bfb675d84b2cfd" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-neutral-950 text-white antialiased">
        <JsonLd data={organizationLd()} />
        {children}
      </body>
    </html>
  );
}
