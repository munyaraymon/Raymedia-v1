import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryGlyph, SearchGlyph } from "@/components/raymedia/icons";
import { SponsorBanner } from "@/components/raymedia/banner";
import {
  CATEGORIES,
  categoryLabel,
  whatsappHref,
  type Directory,
} from "@/lib/raymedia/model";

export function HomeScreen({
  directory,
  category,
}: {
  directory: Directory;
  category: string;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const { ids: savedIds, toggle: toggleSaved } = useFavourites();
  const needle = query.trim().toLowerCase();
  const active = CATEGORIES.find((item) => item.id === category);

  const visibleCategories = CATEGORIES.filter((item) => item.home);

  const matches = useMemo(() => {
    if (!needle) return [];
    return directory.businesses.filter((business) => {
      const hay = [business.name, business.offer, business.area, business.message, business.description, categoryLabel(business.category)]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [directory.businesses, needle]);

  const savedBusinesses = directory.businesses.filter((business) => savedIds.includes(business.id));
  const inCategory = active
    ? directory.businesses.filter((business) => business.category === active.id)
    : [];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto w-full max-w-[440px] px-4 pb-48 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-gold">RAYMEDIA</h1>
            <p className="text-[11px] leading-tight text-muted">Find trusted services near you</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSavedOnly((current) => !current)}
              className="text-[11px] font-semibold text-gold"
            >
              Saved{savedIds.length ? ` ${savedIds.length}` : ""}
            </button>
            <Link
              to="/admin"
              className="inline-flex h-6 shrink-0 items-center rounded-full border border-line px-2 text-[9px] font-semibold tracking-[0.14em] text-muted"
            >
              ADMIN
            </Link>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {!needle && !active ? (
            <h2 className="shrink-0 font-display text-base font-bold leading-none text-gold">Find in Randburg</h2>
          ) : (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                navigate({ to: "/", search: { cat: "" } });
              }}
              className="shrink-0 text-sm font-semibold text-gold"
            >
              Find in Randburg
            </button>
          )}
          <form
            className="ml-auto flex min-w-0 flex-1 gap-1"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="sr-only" htmlFor="find">
              Search local services
            </label>
            <input
              id="find"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="h-8 min-w-0 flex-1 rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none placeholder:text-muted focus:border-gold"
            />
            <button
              type="submit"
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold text-ink"
              aria-label="Search"
            >
              <SearchGlyph />
            </button>
          </form>
        </div>

        {savedOnly ? (
          <section className="mt-4">
            <h2 className="font-display text-2xl font-bold text-gold">Saved</h2>
            <p className="mt-1 text-sm text-muted">Only on this phone. Another person does not see your list.</p>
            {savedBusinesses.length === 0 ? (
              <p className="mt-4 rounded-card border border-line bg-card px-4 py-5 text-sm leading-relaxed text-muted">
                Nothing saved yet. Tap Save on a listing to keep it here.
              </p>
            ) : (
              <BusinessList businesses={savedBusinesses} savedIds={savedIds} onToggleSaved={toggleSaved} />
            )}
          </section>
        ) : needle ? (
          <section className="mt-4">
            <h2 className="font-display text-2xl font-bold text-gold">Results</h2>
            <p className="mt-1 text-sm text-muted">
              {matches.length === 0 ? "Nothing matches that yet." : `${matches.length} in Randburg`}
            </p>
            <BusinessList businesses={matches} savedIds={savedIds} onToggleSaved={toggleSaved} />
          </section>
        ) : active ? (
          <section className="mt-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/", search: { cat: "" } })}
              className="inline-flex h-9 items-center gap-1 text-sm font-medium text-gold"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              All categories
            </button>
            <h2 className="mt-1 font-display text-2xl font-bold text-gold">{active.label}</h2>
            <p className="mt-1 text-sm text-muted">Randburg listings</p>
            {inCategory.length === 0 ? (
              <p className="mt-4 rounded-card border border-line bg-card px-4 py-5 text-sm leading-relaxed text-muted">
                Nothing listed here yet. New businesses show up after they are added in admin.
              </p>
            ) : (
              <BusinessList businesses={inCategory} savedIds={savedIds} onToggleSaved={toggleSaved} />
            )}
          </section>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-1.5">
              {visibleCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate({ to: "/", search: { cat: item.id } })}
                  className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-gold/80 bg-card px-1 py-1.5 text-center"
                >
                  <CategoryGlyph id={item.id} />
                  <span className="text-[11px] font-semibold leading-tight text-fg">{item.short}</span>
                </button>
              ))}
            </div>
        )}
        <ContactUs />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg">
        <div className="mx-auto w-full max-w-[440px] px-3 py-2">
          <SponsorBanner slides={directory.slides} intervalSeconds={directory.intervalSeconds} docked />
        </div>
      </div>
    </div>
  );
}

function ContactUs() {
  const href = whatsappHref("27739422476", "Hi RAYMEDIA, I would like to advertise or list on the directory.");
  if (!href) return null;
  return (
    <section className="mt-2 rounded-xl border border-line bg-card px-3 py-2">
      <h2 className="text-[11px] font-semibold tracking-[0.14em] text-gold">CONTACT US</h2>
      <a
        href={href ?? undefined}
        target="_blank"
        rel="noreferrer"
        className="mt-1 block text-sm font-semibold leading-5 text-fg"
      >
        073 942 2476
      </a>
      <a href="mailto:raymediav1@gmail.com" className="block text-sm font-semibold leading-5 text-fg">
        raymediav1@gmail.com
      </a>
    </section>
  );
}

function BusinessList({
  businesses,
  savedIds,
  onToggleSaved,
}: {
  businesses: Directory["businesses"];
  savedIds: number[];
  onToggleSaved: (id: number) => void;
}) {
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {businesses.map((business) => {
        const href = whatsappHref(business.whatsapp, business.message);
        const visit = business.message.trim().startsWith("http") ? business.message.trim() : "";
        const room = business.category === "property";
        const saved = savedIds.includes(business.id);
        return (
          <li key={business.id} className="rounded-card border border-line bg-card px-4 py-4">
            {business.imageUrl && room ? (
              <img src={business.imageUrl} alt="" className="mb-3 h-36 w-full rounded-xl object-cover" />
            ) : null}
            <div className={business.imageUrl && !room ? "flex gap-3" : ""}>
              {business.imageUrl && !room ? (
                <img src={business.imageUrl} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-gold">{categoryLabel(business.category)}</p>
                  <button type="button" onClick={() => onToggleSaved(business.id)} className="text-xs font-semibold text-gold">
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-fg">{business.name}</h3>
                {business.offer ? <p className="mt-1 text-sm font-medium text-gold">{business.offer}</p> : null}
                {business.description ? <p className="mt-1 text-sm leading-relaxed text-muted">{business.description}</p> : null}
                {business.area ? <p className="mt-1 text-sm text-muted">{business.area}</p> : null}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center rounded-full bg-gold px-4 text-sm font-semibold text-ink"
                >
                  WhatsApp
                </a>
              ) : null}
              {visit ? (
                <a
                  href={visit}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center rounded-full border border-gold px-4 text-sm font-semibold text-gold"
                >
                  Open offer
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const FAVOURITES_KEY = "raymedia-favourites";

function useFavourites() {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
      if (Array.isArray(parsed)) setIds(parsed.filter((id) => typeof id === "number"));
    } catch {
      setIds([]);
    }
  }, []);
  function toggle(id: number) {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next));
      return next;
    });
  }
  return { ids, toggle };
}
