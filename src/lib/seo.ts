import { settings, type DaySchedule } from "@/lib/content";

const DAY_URL: Record<string, string> = {
  Mo: "https://schema.org/Monday",
  Tu: "https://schema.org/Tuesday",
  We: "https://schema.org/Wednesday",
  Th: "https://schema.org/Thursday",
  Fr: "https://schema.org/Friday",
  Sa: "https://schema.org/Saturday",
  Su: "https://schema.org/Sunday",
};

/** schema.org LocalBusiness data built only from verified settings. */
export function localBusinessJsonLd() {
  const s = settings;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "CafeOrCoffeeShop"],
    "@id": `${s.siteUrl}/#business`,
    name: s.name,
    alternateName: s.shortName,
    slogan: s.brandLine,
    description:
      "French-style bakery and café in Garapan, Saipan. Breads, pastries and cakes baked in-house every day, with specialty coffee made with Illy.",
    url: s.siteUrl,
    telephone: s.phone.tel,
    image: [`${s.siteUrl}/photos/exterior.webp`, `${s.siteUrl}/og.png`],
    logo: `${s.siteUrl}/brand/emblem-dark.webp`,
    servesCuisine: ["French", "Bakery", "Coffee"],
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address.line1,
      addressLocality: `${s.address.locality}, ${s.address.island}`,
      addressRegion: s.address.region,
      postalCode: s.address.postalCode,
      addressCountry: s.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: s.geo.lat,
      longitude: s.geo.lng,
    },
    hasMap: s.links.googleMaps,
    sameAs: [s.links.facebook, s.links.instagram],
    hasMenu: `${s.siteUrl}/#menu`,
  };

  // Hours are only published once OHAS confirms them
  if (s.hours.confirmed) {
    data.openingHoursSpecification = (s.hours.schedule as DaySchedule[]).map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => DAY_URL[d]),
      opens: h.opens,
      closes: h.closes,
    }));
  }
  return data;
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
