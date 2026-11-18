import settingsJson from "@/content/settings.json";
import menuJson from "@/content/menu.json";
import cakesJson from "@/content/cakes.json";
import galleryJson from "@/content/gallery.json";

/* ---------- Types ---------- */

export type Tone =
  | "crust"
  | "butter"
  | "cream"
  | "espresso"
  | "strawberry"
  | "avocado"
  | "coconut"
  | "ube"
  | "mango"
  | "matcha";

export type Art = string;

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt?: string;
  /** "cover" (default) fills the frame; "contain" shows the whole photo on `bg`. */
  fit?: "cover" | "contain";
  /** CSS object-position, e.g. "50% 70%". */
  position?: string;
  /** Background behind a "contain" photo. */
  bg?: string;
}

export interface Price {
  amount: number;
  label?: string;
  /** Date OHAS posted it publicly: YYYY-MM-DD or YYYY-MM */
  postedOn: string;
  source?: string;
  /** Date OHAS confirmed it for the website. Null = do not show. */
  confirmedOn: string | null;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  alsoIn?: string[];
  description: string;
  available: boolean;
  signature: boolean;
  todaysBake: boolean;
  seasonal: boolean;
  season?: string;
  prices: Price[];
  allergens: { confirmed: boolean; notes: string[] };
  art: Art;
  tone: Tone;
  photo: Photo | null;
  photoBrief: string;
  link?: string;
  source: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  intro: string;
  emptyMessage?: string;
}

export interface DaySchedule {
  days: string[];
  opens: string;
  closes: string;
}

/* ---------- Data ---------- */

export const settings = settingsJson;
export const menu = menuJson as unknown as {
  note: string;
  categories: MenuCategory[];
  items: MenuItem[];
};
export const cakes = cakesJson as unknown as {
  sizes: { id: string; label: string; shape: "round" | "square"; inches: number; display: string; note: string }[];
  regularPrices: Price[];
  ordering: {
    confirmed: boolean;
    noticeNeeded: string;
    customMessages: string;
    deposit: string;
    pickupOrDelivery: string;
    unconfirmedMessage: string;
    source?: string;
  };
  collections: {
    id: string;
    title: string;
    /** Small heading above the title; defaults to in-the-case / past-season wording. */
    label?: string;
    note?: string;
    season: string;
    current: boolean;
    source: string;
    cakes: { id: string; name: string; kind: string; tone: Tone; art: Art; prices: Price[]; photo?: Photo | null }[];
    desserts: string[];
  }[];
};
export const gallery = galleryJson as unknown as {
  shots: {
    id: string;
    title: string;
    alt: string;
    brief: string;
    art: Art;
    tone: Tone;
    span: "wide" | "tall" | "square";
    photo: Photo | null;
  }[];
};

/* ---------- Helpers ---------- */

export const telHref = `tel:${settings.phone.tel}`;

export const fullAddress = `${settings.address.line1}, ${settings.address.locality}, ${settings.address.island}, ${settings.address.region} ${settings.address.postalCode}`;

/** Prices that may be shown on the live site (confirmed by OHAS). */
export function confirmedPrices(prices: Price[]): Price[] {
  return prices.filter((p) => Boolean(p.confirmedOn));
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-05-28" -> "May 28, 2026"; "2026-02" -> "Feb 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!m) return String(y);
  if (!d) return `${MONTHS[m - 1]} ${y}`;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const DAY_NAMES: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};
const DAY_ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** "07:00" -> "7:00 a.m." */
export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "p.m." : "a.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDays(days: string[]): string {
  if (days.length === 7) return "Every day";
  const idx = days.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (contiguous && idx.length > 2) {
    return `${DAY_NAMES[DAY_ORDER[idx[0]]]} – ${DAY_NAMES[DAY_ORDER[idx[idx.length - 1]]]}`;
  }
  return idx.map((i) => DAY_NAMES[DAY_ORDER[i]].slice(0, 3)).join(", ");
}

export interface HoursLine {
  days: string;
  time: string;
}

/** Confirmed opening hours as display lines, or null if not confirmed. */
export function confirmedHours(): HoursLine[] | null {
  if (!settings.hours.confirmed) return null;
  return (settings.hours.schedule as DaySchedule[]).map((s) => ({
    days: formatDays(s.days),
    time: `${formatTime(s.opens)} – ${formatTime(s.closes)}`,
  }));
}

/** Active, real services only (online ordering, delivery…). */
export function activeServices() {
  const labels: Record<string, string> = {
    onlineOrdering: "Order online",
    delivery: "Delivery",
    catering: "Catering",
    reservations: "Reserve a table",
  };
  return Object.entries(settings.services)
    .filter(([k, v]) => !k.startsWith("_") && typeof v === "object" && v.enabled && v.url)
    .map(([k, v]) => ({ id: k, label: labels[k] ?? k, url: (v as { url: string }).url }));
}

export function itemsForCategory(categoryId: string, includeUnavailable = false): MenuItem[] {
  return menu.items.filter(
    (i) =>
      (i.category === categoryId || i.alsoIn?.includes(categoryId)) &&
      (includeUnavailable || i.available),
  );
}

export const NAV = [
  { href: "#top", label: "Home" },
  { href: "#story", label: "Our Story" },
  { href: "#menu", label: "Menu" },
  { href: "#cakes", label: "Cakes & Orders" },
  { href: "#cafe", label: "The Café" },
  { href: "#visit", label: "Visit Us" },
  { href: "#contact", label: "Contact" },
] as const;
