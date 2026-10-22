import {
  Car,
  GraduationCap,
  Home,
  LayoutGrid,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Sprout,
  Utensils,
  Wrench,
} from "lucide-react";

export function TikTokMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-fg">
      <path
        fill="currentColor"
        d="M14.5 3c.4 2.4 1.7 4.1 4 4.6v2.4c-1.4 0-2.7-.4-4-1.2v6.5c0 3.4-2.6 5.9-6 5.9S2.5 18.7 2.5 15.3c0-3.3 2.5-5.8 5.8-5.9v2.5c-1.8.1-3.2 1.6-3.2 3.4 0 1.9 1.5 3.4 3.4 3.4s3.4-1.5 3.4-3.4V3h2.6Z"
      />
    </svg>
  );
}

export function SearchGlyph() {
  return <Search className="size-5" strokeWidth={2.4} aria-hidden="true" />;
}

const iconClass = "size-5 text-muted";

export function CategoryGlyph({ id }: { id: string }) {
  if (id === "food") return <Utensils className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "home") return <Wrench className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "beauty") return <Sparkles className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "auto") return <Car className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "health") return <Plus className={iconClass} strokeWidth={2.4} aria-hidden="true" />;
  if (id === "retail") return <ShoppingBag className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "edu") return <GraduationCap className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "deals") return <Package className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "farm") return <Sprout className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  if (id === "property") return <Home className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
  return <LayoutGrid className={iconClass} strokeWidth={1.8} aria-hidden="true" />;
}
