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
