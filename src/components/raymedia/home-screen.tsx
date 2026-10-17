import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryGlyph, SearchGlyph, TikTokMark } from "@/components/raymedia/icons";
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
  const needle = query.trim().toLowerCase();
  const active = CATEGORIES.find((item) => item.id === category);

  const visibleCategories = CATEGORIES.filter((item) => {
    if (item.home) return true;
    return directory.businesses.some((business) => business.category === item.id);
  });

  const matches = useMemo(() => {
    if (!needle) return [];
    return directory.businesses.filter((business) => {
      const hay = [business.name, business.offer, business.area, business.message, categoryLabel(business.category)]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [directory.businesses, needle]);

  const inCategory = active
    ? directory.businesses.filter((business) => business.category === active.id)
    : [];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto w-full max-w-[440px] px-4 pb-28 pt-5">
        <div className="flex justify-center">
          <TikTokMark />
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-gold">RAYMEDIA</h1>

        <form
          className="mt-5 flex gap-2"
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
            placeholder="Search pizza, plumber, nails..."
            className="h-14 min-w-0 flex-1 rounded-3xl border border-line bg-surface px-4 text-base text-fg outline-none placeholder:text-muted focus:border-gold"
          />
          <button
            type="submit"
            className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold text-ink"
            aria-label="Search"
          >
            <SearchGlyph />
          </button>
        </form>

        {needle ? (
          <section className="mt-8">
            <h2 className="font-display text-3xl font-bold text-gold">Results</h2>
            <p className="mt-1 text-sm text-muted">
              {matches.length === 0 ? "Nothing matches that yet." : `${matches.length} in Randburg`}
            </p>
            <BusinessList businesses={matches} />
          </section>
        ) : active ? (
          <section className="mt-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/", search: { cat: "" } })}
              className="inline-flex h-11 items-center gap-1 text-sm font-medium text-gold"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              All categories
            </button>
            <h2 className="mt-2 font-display text-3xl font-bold text-gold">{active.label}</h2>
            <p className="mt-1 text-sm text-muted">Randburg listings</p>
            {inCategory.length === 0 ? (
              <p className="mt-6 rounded-card border border-line bg-card px-4 py-6 text-sm leading-relaxed text-muted">
                Nothing listed here yet. New businesses show up after they are added in admin.
              </p>
            ) : (
              <BusinessList businesses={inCategory} />
            )}
          </section>
        ) : (
          <>
            <h2 className="mt-8 font-display text-3xl font-bold leading-tight text-gold">Find in Randburg</h2>
            <p className="mt-1 text-sm text-muted">Choose a category to explore local services</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {visibleCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate({ to: "/", search: { cat: item.id } })}
                  className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-card border border-gold/80 bg-card px-3 py-5 text-center"
                >
                  <CategoryGlyph id={item.id} />
                  <span className="text-base font-semibold leading-tight text-fg">{item.label}</span>
                </button>
              ))}
            </div>
            <SponsorBanner slides={directory.slides} intervalSeconds={directory.intervalSeconds} />
          </>
        )}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center">
        <div className="flex w-full max-w-[440px] justify-end p-4 pb-5">
          <Link
            to="/admin"
            className="pointer-events-auto inline-flex h-11 items-center rounded-full border border-line bg-surface/95 px-4 text-xs font-semibold tracking-[0.16em] text-muted"
          >
            ADMIN
          </Link>
        </div>
      </div>
    </div>
  );
}

function BusinessList({
  businesses,
}: {
  businesses: Directory["businesses"];
}) {
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {businesses.map((business) => {
        const href = whatsappHref(business.whatsapp, business.message);
        const visit = business.message.trim().startsWith("http") ? business.message.trim() : "";
        return (
          <li key={business.id} className="rounded-card border border-line bg-card px-4 py-4">
            <p className="text-xs font-medium tracking-wide text-gold">{categoryLabel(business.category)}</p>
            <h3 className="mt-1 text-lg font-semibold text-fg">{business.name}</h3>
            {business.offer ? <p className="mt-1 text-sm font-medium text-gold">{business.offer}</p> : null}
            {business.area ? <p className="mt-1 text-sm text-muted">{business.area}</p> : null}
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
