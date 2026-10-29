import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { addBusiness, checkPin, removeBusiness, saveBanner, updateBusiness } from "@/lib/raymedia/api";
import { CATEGORIES, categoryLabel, type Directory } from "@/lib/raymedia/model";

const TEST_BANNER = "/banner-raymedia.jpg";

const fieldClass =
  "h-12 w-full rounded-xl border border-line bg-surface px-3 text-base text-fg outline-none placeholder:text-muted focus:border-gold";

type SlideDraft = {
  key: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
};

function Overview({ listings, slides }: { listings: Directory["businesses"]; slides: number }) {
  const rooms = listings.filter((item) => item.category === "property").length;
  const withPhoto = listings.filter((item) => item.imageUrl).length;
  const cards = [
    ["Active listings", String(listings.length)],
    ["Rooms listed", String(rooms)],
    ["With a photo", String(withPhoto)],
    ["Banner slides", String(slides)],
  ];
  return (
    <section className="mt-4 rounded-card border border-line bg-card p-3">
      <h2 className="text-sm font-bold text-fg">Overview</h2>
      <p className="mt-1 text-xs text-muted">Live counts from the site. Visitors are not counted yet.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-surface px-3 py-2">
            <p className="text-[11px] text-muted">{label}</p>
            <p className="mt-1 text-xl font-semibold text-fg">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function draftsFrom(directory: Directory): SlideDraft[] {
  const source = directory.slides.length
    ? directory.slides
    : [{ id: 0, sortOrder: 0, imageUrl: "", title: "", subtitle: "", link: "" }];
  return source.map((slide) => ({
    key: `slide-${slide.id}-${slide.sortOrder}`,
    imageUrl: slide.imageUrl,
    title: slide.title,
    subtitle: slide.subtitle,
    link: slide.link,
  }));
}

export function AdminScreen({ directory }: { directory: Directory }) {
  const verify = useServerFn(checkPin);
  const saveBannerFn = useServerFn(saveBanner);
  const addBusinessFn = useServerFn(addBusiness);
  const updateBusinessFn = useServerFn(updateBusiness);
  const removeBusinessFn = useServerFn(removeBusiness);

  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [gateError, setGateError] = useState("");
  const [checking, setChecking] = useState(false);
  const [slides, setSlides] = useState<SlideDraft[]>(() => draftsFrom(directory));
  const [intervalSeconds, setIntervalSeconds] = useState(directory.intervalSeconds || 5);
  const [bannerNote, setBannerNote] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [savingBanner, setSavingBanner] = useState(false);

  const [category, setCategory] = useState<string>(CATEGORIES[0].id);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [offer, setOffer] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [feedNote, setFeedNote] = useState("");
  const [feedError, setFeedError] = useState("");
  const [savingFeed, setSavingFeed] = useState(false);
  const [listings, setListings] = useState(directory.businesses);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingRemove, setPendingRemove] = useState<number | null>(null);

  async function unlock(event: React.FormEvent) {
    event.preventDefault();
    setChecking(true);
    setGateError("");
    try {
      await verify({ data: { pin } });
      setUnlocked(true);
    } catch {
      setGateError("Wrong password");
    } finally {
      setChecking(false);
    }
  }

  async function onSaveBanner(event: React.FormEvent) {
    event.preventDefault();
    setSavingBanner(true);
    setBannerError("");
    setBannerNote("");
    try {
      const next = await saveBannerFn({
        data: {
          pin,
          intervalSeconds,
          slides: slides.map(({ imageUrl, title, subtitle, link }) => ({
            imageUrl,
            title,
            subtitle,
            link,
          })),
        },
      });
      setSlides(draftsFrom(next));
      setIntervalSeconds(next.intervalSeconds);
      setListings(next.businesses);
      setBannerNote("Saved. The home banner is live for everyone.");
    } catch (error) {
      setBannerError(error instanceof Error ? error.message : "Could not save the banner");
    } finally {
      setSavingBanner(false);
    }
  }

  async function onAddBusiness(event: React.FormEvent) {
    event.preventDefault();
    setSavingFeed(true);
    setFeedError("");
    setFeedNote("");
    try {
      const next = editingId
        ? await updateBusinessFn({
            data: { pin, id: editingId, category, name, whatsapp, offer, area, message, imageUrl, description },
          })
        : await addBusinessFn({
            data: { pin, category, name, whatsapp, offer, area, message, imageUrl, description },
          });
      setListings(next.businesses);
      setName("");
      setWhatsapp("");
      setOffer("");
      setArea("");
      setMessage("");
      setImageUrl("");
      setDescription("");
      setEditingId(null);
      setFeedNote(editingId ? "Updated for every visitor." : "Live on the home page for every visitor.");
    } catch (error) {
      setFeedError(error instanceof Error ? error.message : "Could not add that business");
    } finally {
      setSavingFeed(false);
    }
  }

  function startEdit(id: number) {
    const business = listings.find((item) => item.id === id);
    if (!business) return;
    setEditingId(id);
    setCategory(business.category);
    setName(business.name);
    setWhatsapp(business.whatsapp);
    setOffer(business.offer);
    setArea(business.area);
    setMessage(business.message);
    setImageUrl(business.imageUrl);
    setDescription(business.description);
    setFeedError("");
    setFeedNote("");
    setPendingRemove(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setWhatsapp("");
    setOffer("");
    setArea("");
    setMessage("");
    setImageUrl("");
    setDescription("");
    setFeedNote("");
    setFeedError("");
  }

  async function onRemove(id: number) {
    setFeedError("");
    try {
      const next = await removeBusinessFn({ data: { pin, id } });
      setListings(next.businesses);
      setPendingRemove(null);
    } catch (error) {
      setFeedError(error instanceof Error ? error.message : "Could not remove that listing");
    }
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto w-full max-w-[440px] px-4 pb-16 pt-5">
        <Link to="/" search={{ cat: "" }} className="inline-flex h-11 items-center gap-1 text-sm text-muted">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Home
        </Link>
        <p className="mt-3 font-display text-sm font-bold tracking-[0.18em] text-gold">RAYMEDIA ADMIN</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-fg">Owner controls</h1>
        {directory.shared ? null : (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A save on the public site reaches every visitor only after DATABASE_URL is set in Vercel.
          </p>
        )}

        {unlocked ? <Overview listings={listings} slides={slides.length} /> : null}

        {unlocked ? null : (
          <form onSubmit={unlock} className="mt-6 rounded-card border border-gold/70 bg-card p-4">
            <p className="text-sm leading-relaxed text-muted">
              This page is only for you. Visitors never see these controls.
            </p>
            <label className="mt-4 block text-xs font-medium tracking-wide text-muted" htmlFor="pin">
              Password
            </label>
            <input
              id="pin"
              type="password"
              autoComplete="current-password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              className={`${fieldClass} mt-2`}
            />
            {gateError ? <p className="mt-2 text-sm text-gold">{gateError}</p> : null}
            <button
              type="submit"
              disabled={checking || pin.length === 0}
              className="mt-4 h-12 w-full rounded-xl bg-gold text-sm font-bold tracking-wide text-ink disabled:opacity-60"
            >
              {checking ? "Checking…" : "ENTER ADMIN"}
            </button>
          </form>
        )}

        {unlocked ? (
          <>
            <form onSubmit={onSaveBanner} className="mt-6 rounded-card border border-line bg-card p-4">
              <h2 className="text-sm font-bold tracking-wide text-gold">BANNER CONTROL</h2>
              <p className="mt-1 text-sm text-muted">Slideshow timer for the sponsored card on the home page.</p>
              <label className="mt-4 block text-xs font-medium text-muted" htmlFor="interval">
                Ad interval (seconds)
              </label>
              <input
                id="interval"
                type="number"
                min={2}
                max={30}
                value={intervalSeconds}
                onChange={(event) => setIntervalSeconds(Number(event.target.value))}
                className={`${fieldClass} mt-2`}
              />

              <div className="mt-4 flex flex-col gap-3">
                {slides.map((slide, index) => (
                  <fieldset key={slide.key} className="rounded-2xl border border-line bg-bg p-3">
                    <legend className="px-1 text-xs font-semibold tracking-wide text-gold">Slide {index + 1}</legend>
                    <label className="mt-2 block text-xs text-muted">
                      Image URL
                      <input
                        value={slide.imageUrl}
                        onChange={(event) => updateSlide(index, { imageUrl: event.target.value })}
                        placeholder="/banner-raymedia.jpg"
                        className={`${fieldClass} mt-1`}
                      />
                      <button
                        type="button"
                        onClick={() => updateSlide(index, { imageUrl: TEST_BANNER })}
                        className="mt-2 text-xs font-semibold text-gold"
                      >
                        Use test picture
                      </button>
                    </label>
                    <label className="mt-2 block text-xs text-muted">
                      Big title
                      <input
                        value={slide.title}
                        onChange={(event) => updateSlide(index, { title: event.target.value })}
                        placeholder="Raymedia"
                        className={`${fieldClass} mt-1`}
                      />
                    </label>
                    <label className="mt-2 block text-xs text-muted">
                      Small subtitle
                      <input
                        value={slide.subtitle}
                        onChange={(event) => updateSlide(index, { subtitle: event.target.value })}
                        placeholder="Advertise in Randburg from R250/month"
                        className={`${fieldClass} mt-1`}
                      />
                    </label>
                    <label className="mt-2 block text-xs text-muted">
                      Link
                      <input
                        value={slide.link}
                        onChange={(event) => updateSlide(index, { link: event.target.value })}
                        placeholder="https://wa.me/27…"
                        className={`${fieldClass} mt-1`}
                      />
                    </label>
                    {slides.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => setSlides((current) => current.filter((_, item) => item !== index))}
                        className="mt-2 h-10 text-sm text-muted"
                      >
                        Remove slide
                      </button>
                    ) : null}
                  </fieldset>
                ))}
              </div>

              {slides.length < 8 ? (
                <button
                  type="button"
                  onClick={() =>
                    setSlides((current) => [
                      ...current,
                      { key: `new-${Date.now()}`, imageUrl: "", title: "", subtitle: "", link: "" },
                    ])
                  }
                  className="mt-3 h-11 w-full rounded-xl border border-line text-sm font-semibold text-fg"
                >
                  + Add slide
                </button>
              ) : null}

              {bannerError ? <p className="mt-3 text-sm text-gold">{bannerError}</p> : null}
              {bannerNote ? <p className="mt-3 text-sm text-muted">{bannerNote}</p> : null}
              <button
                type="submit"
                disabled={savingBanner}
                className="mt-4 h-12 w-full rounded-xl bg-gold text-sm font-bold tracking-wide text-ink disabled:opacity-60"
              >
                {savingBanner ? "SAVING…" : "SAVE BANNER + HOME UPDATES"}
              </button>
            </form>

            <form onSubmit={onAddBusiness} className="mt-4 rounded-card border border-line bg-card p-4">
              <h2 className="text-sm font-bold tracking-wide text-gold">{editingId ? "EDIT LISTING" : "ADD BUSINESS"}</h2>
              <p className="mt-1 text-sm text-muted">
                {editingId ? "Change this listing, then save. It updates for everyone." : "Saves for all visitors. Offer shows on the listing."}
              </p>
              <label className="mt-4 block text-xs font-medium text-muted" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`${fieldClass} mt-2`}
              >
                {CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <label className="mt-3 block text-xs text-muted" htmlFor="biz-name">
                Business name
              </label>
              <input id="biz-name" value={name} onChange={(event) => setName(event.target.value)} className={`${fieldClass} mt-1`} />
              <label className="mt-3 block text-xs text-muted" htmlFor="biz-wa">
                WhatsApp
              </label>
              <input
                id="biz-wa"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="27…"
                inputMode="tel"
                className={`${fieldClass} mt-1`}
              />
              <label className="mt-3 block text-xs text-muted" htmlFor="biz-photo">
                Picture link
              </label>
              <input
                id="biz-photo"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://… a wide photo, not a phone file"
                className={`${fieldClass} mt-1`}
              />
              <label className="mt-3 block text-xs text-muted" htmlFor="biz-description">
                Description
              </label>
              <textarea
                id="biz-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="What they do, or for a room: available now"
                className="mt-1 w-full resize-none rounded-xl border border-line bg-surface px-3 py-2 text-base text-fg outline-none placeholder:text-muted focus:border-gold"
              />
              <label className="mt-3 block text-xs text-muted" htmlFor="biz-offer">
                Offer
              </label>
              <input
                id="biz-offer"
                value={offer}
                onChange={(event) => setOffer(event.target.value)}
                placeholder="eg. 20% off haircuts"
                className={`${fieldClass} mt-1`}
              />
              <label className="mt-3 block text-xs text-muted" htmlFor="biz-area">
                Address / area
              </label>
              <input
                id="biz-area"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="eg. Randburg"
                className={`${fieldClass} mt-1`}
              />
              <label className="mt-3 block text-xs text-muted" htmlFor="biz-message">
                WhatsApp message
              </label>
              <input
                id="biz-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Hi, I found you on Raymedia"
                className={`${fieldClass} mt-1`}
              />
              {feedError ? <p className="mt-3 text-sm text-gold">{feedError}</p> : null}
              {feedNote ? <p className="mt-3 text-sm text-muted">{feedNote}</p> : null}
              <button
                type="submit"
                disabled={savingFeed}
                className="mt-4 h-12 w-full rounded-xl bg-gold text-sm font-bold tracking-wide text-ink disabled:opacity-60"
              >
                {savingFeed ? "SAVING…" : editingId ? "UPDATE LISTING" : "SAVE TO FEED — MAKE LIVE"}
              </button>
              {editingId ? (
                <button type="button" onClick={cancelEdit} className="mt-2 h-10 w-full text-sm text-muted">
                  Cancel edit
                </button>
              ) : null}
            </form>

            <section className="mt-4">
              <p className="text-xs tracking-wide text-muted">
                Saved ({listings.length}) · visible to everyone
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {listings.map((business) => (
                  <li key={business.id} className="rounded-2xl border border-line bg-card px-3 py-3">
                    <p className="text-sm font-semibold text-fg">{business.name}</p>
                    <p className="text-xs text-muted">
                      {categoryLabel(business.category)}
                      {business.offer ? ` · ${business.offer}` : ""}
                    </p>
                    {pendingRemove === business.id ? (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => onRemove(business.id)}
                          className="h-10 rounded-full bg-gold px-3 text-xs font-bold text-ink"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingRemove(null)}
                          className="h-10 rounded-full px-3 text-xs text-muted"
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1 flex gap-3">
                        <button type="button" onClick={() => startEdit(business.id)} className="h-10 text-xs font-semibold text-gold">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingRemove(business.id)}
                          className="h-10 text-xs text-muted"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );

  function updateSlide(index: number, patch: Partial<SlideDraft>) {
    setSlides((current) => current.map((slide, item) => (item === index ? { ...slide, ...patch } : slide)));
  }
}
