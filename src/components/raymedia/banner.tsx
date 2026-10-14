import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Slide } from "@/lib/raymedia/model";

export function SponsorBanner({
  slides,
  intervalSeconds,
}: {
  slides: Slide[];
  intervalSeconds: number;
}) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const count = slides.length;
  const safeIndex = count === 0 ? 0 : index % count;
  const slide = slides[safeIndex];

  useEffect(() => {
    if (count < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, Math.max(2, intervalSeconds) * 1000);
    return () => window.clearInterval(timer);
  }, [count, intervalSeconds]);

  if (!slide) return null;

  const image = slide.imageUrl && !broken[slide.id] ? slide.imageUrl : "";
  const open = () => {
    if (!slide.link) return;
    window.open(slide.link, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mt-5" aria-roledescription="carousel" aria-label="Sponsored">
      <button
        type="button"
        onClick={open}
        disabled={!slide.link}
        className="w-full rounded-card border border-gold/80 bg-card px-4 py-4 text-left disabled:cursor-default"
      >
        <p className="text-xs font-medium tracking-wide text-muted">AD · Sponsored</p>
        {image ? (
          <img
            src={image}
            alt=""
            className="ray-swap mt-3 h-40 w-full rounded-2xl object-cover"
            onError={() => setBroken((current) => ({ ...current, [slide.id]: true }))}
          />
        ) : null}
        <div className="mt-3 flex items-start gap-3">
          {image ? null : (
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-gold">
              <RefreshCw className="size-5" aria-hidden="true" />
            </span>
          )}
          <span className="min-w-0">
            <span className="block text-base font-semibold leading-snug text-fg">{slide.title}</span>
            {slide.subtitle ? (
              <span className="mt-1 block text-sm leading-snug text-muted">{slide.subtitle}</span>
            ) : null}
          </span>
        </div>
      </button>
      {count > 1 ? (
        <div className="mt-3 flex justify-center gap-2" role="tablist" aria-label="Slides">
          {slides.map((item, dot) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={dot === safeIndex}
              aria-label={`Slide ${dot + 1}`}
              onClick={() => setIndex(dot)}
              className={`h-2 rounded-full ${dot === safeIndex ? "w-6 bg-gold" : "w-2 bg-line"}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
