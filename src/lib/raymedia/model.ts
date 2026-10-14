export const CATEGORIES = [
  { id: "beauty", label: "Beauty & Care", home: true },
  { id: "auto", label: "Auto & Repair", home: true },
  { id: "health", label: "Health", home: true },
  { id: "retail", label: "Shopping & Retail", home: true },
  { id: "edu", label: "Education & Kids", home: true },
  { id: "deals", label: "Deals from Amazon", home: true },
  { id: "farm", label: "Farm Services", home: false },
  { id: "other", label: "Other", home: false },
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
