import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { settings } from "@/lib/content";
import { jsonLdScript, localBusinessJsonLd } from "@/lib/seo";

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  display: "swap",
});

const title = "OHAS Boulangerie & Café | French Bakery & Café in Garapan, Saipan";
const description =
  "Fresh-baked French breads, pastries and cakes, baked in-house every day, with specialty coffee made with Illy. On the corner of Beach Road & Orchid Street, Garapan, Saipan. Pre-order cakes for birthdays and celebrations.";

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  title,
  description,
  applicationName: settings.name,
  keywords: [
    "OHAS",
    "bakery Saipan",
    "French bakery Garapan",
    "boulangerie Saipan",
    "café Garapan",
    "croissant Saipan",
    "cakes Saipan",
    "coffee Saipan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: settings.name,
    title,
    description,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "OHAS Boulangerie & Café — French, Fresh, Fit." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Skip the intro on repeat visits (runs before paint to avoid a flash). */
const introScript = `try{if(sessionStorage.getItem('ohas-intro'))document.documentElement.classList.add('no-loader')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessJsonLd()) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[95] rounded-full bg-espresso px-5 py-3 text-flour focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
