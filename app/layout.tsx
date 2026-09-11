import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_DESC, DEFAULT_TITLE, organizationLd, pageMeta } from "@/lib/seo";
import "./globals.css";

const GA_ID = "G-B61Q45GJTS";
const METRICOOL_HASH = "7e5a8161d01d2ae3adb4816e90d022c9";

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
  verification: { google: "fLzFitsqvo79yVCufrRX4TDlI96-lD3lwseac-6uadI" },
  other: { "p:domain_verify": "f3dd95d73b9d9d5265bfb675d84b2cfd" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"${METRICOOL_HASH}"})});`,
          }}
        />
      </head>
      <body className="bg-neutral-950 text-white antialiased">
        <JsonLd data={organizationLd()} />
        {children}
      </body>
    </html>
  );
}
