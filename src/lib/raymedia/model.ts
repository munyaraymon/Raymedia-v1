export const CATEGORIES = [
  { id: "food", label: "Food & Takeaway", short: "Food", home: true },
  { id: "home", label: "Home Services", short: "Home", home: true },
  { id: "beauty", label: "Beauty & Care", short: "Beauty", home: true },
  { id: "auto", label: "Auto & Repair", short: "Auto", home: true },
  { id: "health", label: "Health", short: "Health", home: true },
  { id: "retail", label: "Shopping & Retail", short: "Shopping", home: true },
  { id: "deals", label: "Deals from Amazon", short: "Amazon", home: true },
  { id: "edu", label: "Education & Kids", short: "Kids", home: true },
  { id: "farm", label: "Farm Services", short: "Farm", home: true },
  { id: "other", label: "Other", short: "Other", home: true },
  { id: "property", label: "Rooms & Flats", short: "Rooms & Flats", home: false },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Slide = {
  id: number;
  sortOrder: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
};

export type Business = {
  id: number;
  category: string;
  name: string;
  whatsapp: string;
  offer: string;
  area: string;
  message: string;
};

export type Directory = {
  intervalSeconds: number;
  slides: Slide[];
  businesses: Business[];
};

export function categoryLabel(id: string): string {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}

export function whatsappHref(raw: string, message: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const text = message.trim();
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function safeHttp(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString();
  } catch {
    return "";
  }
}
