import { o as __toESM } from "../_runtime.mjs";
import { n as categoryLabel, t as CATEGORIES } from "./model-DodFDazk.mjs";
import { K as isRedirect, S as require_jsx_runtime, X as require_react, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as checkPin, i as addBusiness, n as Route, o as removeBusiness, s as saveBanner } from "./router-DUa2sQRG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-L1cVvknQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var PIN_KEY = "raymedia-admin-pin";
var fieldClass = "h-12 w-full rounded-xl border border-line bg-surface px-3 text-base text-fg outline-none placeholder:text-muted focus:border-gold";
function draftsFrom(directory) {
	return (directory.slides.length ? directory.slides : [{
		id: 0,
		sortOrder: 0,
		imageUrl: "",
		title: "",
		subtitle: "",
		link: ""
	}]).map((slide) => ({
		key: `slide-${slide.id}-${slide.sortOrder}`,
		imageUrl: slide.imageUrl,
		title: slide.title,
		subtitle: slide.subtitle,
		link: slide.link
	}));
}
function AdminScreen({ directory }) {
	const verify = useServerFn(checkPin);
	const saveBannerFn = useServerFn(saveBanner);
	const addBusinessFn = useServerFn(addBusiness);
	const removeBusinessFn = useServerFn(removeBusiness);
	const [pin, setPin] = (0, import_react.useState)("");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [gateError, setGateError] = (0, import_react.useState)("");
	const [checking, setChecking] = (0, import_react.useState)(false);
	const [intervalSeconds, setIntervalSeconds] = (0, import_react.useState)(directory.intervalSeconds);
	const [slides, setSlides] = (0, import_react.useState)(() => draftsFrom(directory));
	const [bannerNote, setBannerNote] = (0, import_react.useState)("");
	const [bannerError, setBannerError] = (0, import_react.useState)("");
	const [savingBanner, setSavingBanner] = (0, import_react.useState)(false);
	const [category, setCategory] = (0, import_react.useState)(CATEGORIES[0].id);
	const [name, setName] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [offer, setOffer] = (0, import_react.useState)("");
	const [area, setArea] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [feedNote, setFeedNote] = (0, import_react.useState)("");
	const [feedError, setFeedError] = (0, import_react.useState)("");
	const [savingFeed, setSavingFeed] = (0, import_react.useState)(false);
	const [listings, setListings] = (0, import_react.useState)(directory.businesses);
	const [pendingRemove, setPendingRemove] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const stored = sessionStorage.getItem(PIN_KEY);
		if (!stored) return;
		let cancelled = false;
		verify({ data: { pin: stored } }).then(() => {
			if (cancelled) return;
			setPin(stored);
			setUnlocked(true);
		}).catch(() => {
			sessionStorage.removeItem(PIN_KEY);
		});
		return () => {
			cancelled = true;
		};
	}, [verify]);
	async function unlock(event) {
		event.preventDefault();
		setChecking(true);
		setGateError("");
		try {
			await verify({ data: { pin } });
			sessionStorage.setItem(PIN_KEY, pin);
			setUnlocked(true);
		} catch {
			setGateError("Wrong password");
		} finally {
			setChecking(false);
		}
	}
	async function onSaveBanner(event) {
		event.preventDefault();
		setSavingBanner(true);
		setBannerError("");
		setBannerNote("");
		try {
			const next = await saveBannerFn({ data: {
				pin,
				intervalSeconds,
				slides: slides.map(({ imageUrl, title, subtitle, link }) => ({
					imageUrl,
					title,
					subtitle,
					link
				}))
			} });
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
	async function onAddBusiness(event) {
		event.preventDefault();
		setSavingFeed(true);
		setFeedError("");
		setFeedNote("");
		try {
			const next = await addBusinessFn({ data: {
				pin,
				category,
				name,
				whatsapp,
				offer,
				area,
				message
			} });
			setListings(next.businesses);
			setName("");
			setWhatsapp("");
			setOffer("");
			setArea("");
			setMessage("");
			setFeedNote("Live on the home page for every visitor.");
		} catch (error) {
			setFeedError(error instanceof Error ? error.message : "Could not add that business");
		} finally {
			setSavingFeed(false);
		}
	}
	async function onRemove(id) {
		setFeedError("");
		try {
			const next = await removeBusinessFn({ data: {
				pin,
				id
			} });
			setListings(next.businesses);
			setPendingRemove(null);
		} catch (error) {
			setFeedError(error instanceof Error ? error.message : "Could not remove that listing");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-[440px] px-4 pb-16 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					search: { cat: "" },
					className: "inline-flex h-11 items-center gap-1 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
						className: "size-4",
						"aria-hidden": "true"
					}), "Home"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-sm font-bold tracking-[0.18em] text-gold",
					children: "RAYMEDIA ADMIN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-extrabold text-fg",
					children: "Owner controls"
				}),
				unlocked ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: unlock,
					className: "mt-6 rounded-card border border-gold/70 bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "This page is only for you. Visitors never see these controls."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-xs font-medium tracking-wide text-muted",
							htmlFor: "pin",
							children: "Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "pin",
							type: "password",
							autoComplete: "current-password",
							value: pin,
							onChange: (event) => setPin(event.target.value),
							className: `${fieldClass} mt-2`
						}),
						gateError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-gold",
							children: gateError
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: checking || pin.length === 0,
							className: "mt-4 h-12 w-full rounded-xl bg-gold text-sm font-bold tracking-wide text-ink disabled:opacity-60",
							children: checking ? "Checking…" : "ENTER ADMIN"
						})
					]
				}),
				unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onSaveBanner,
						className: "mt-6 rounded-card border border-line bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-bold tracking-wide text-gold",
								children: "BANNER CONTROL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Slideshow timer for the sponsored card on the home page."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-4 block text-xs font-medium text-muted",
								htmlFor: "interval",
								children: "Ad interval (seconds)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "interval",
								type: "number",
								min: 2,
								max: 30,
								value: intervalSeconds,
								onChange: (event) => setIntervalSeconds(Number(event.target.value)),
								className: `${fieldClass} mt-2`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-col gap-3",
								children: slides.map((slide, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
									className: "rounded-2xl border border-line bg-bg p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
											className: "px-1 text-xs font-semibold tracking-wide text-gold",
											children: ["Slide ", index + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-2 block text-xs text-muted",
											children: ["Image URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: slide.imageUrl,
												onChange: (event) => updateSlide(index, { imageUrl: event.target.value }),
												placeholder: "https://i.postimg.cc/…",
												className: `${fieldClass} mt-1`
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-2 block text-xs text-muted",
											children: ["Big title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: slide.title,
												onChange: (event) => updateSlide(index, { title: event.target.value }),
												placeholder: "Raymedia",
												className: `${fieldClass} mt-1`
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-2 block text-xs text-muted",
											children: ["Small subtitle", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: slide.subtitle,
												onChange: (event) => updateSlide(index, { subtitle: event.target.value }),
												placeholder: "Advertise in Randburg from R250/month",
												className: `${fieldClass} mt-1`
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-2 block text-xs text-muted",
											children: ["Link", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: slide.link,
												onChange: (event) => updateSlide(index, { link: event.target.value }),
												placeholder: "https://wa.me/27…",
												className: `${fieldClass} mt-1`
											})]
										}),
										slides.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setSlides((current) => current.filter((_, item) => item !== index)),
											className: "mt-2 h-10 text-sm text-muted",
											children: "Remove slide"
										}) : null
									]
								}, slide.key))
							}),
							slides.length < 8 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSlides((current) => [...current, {
									key: `new-${Date.now()}`,
									imageUrl: "",
									title: "",
									subtitle: "",
									link: ""
								}]),
								className: "mt-3 h-11 w-full rounded-xl border border-line text-sm font-semibold text-fg",
								children: "+ Add slide"
							}) : null,
							bannerError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-gold",
								children: bannerError
							}) : null,
							bannerNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: bannerNote
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: savingBanner,
								className: "mt-4 h-12 w-full rounded-xl bg-gold text-sm font-bold tracking-wide text-ink disabled:opacity-60",
								children: savingBanner ? "SAVING…" : "SAVE BANNER + HOME UPDATES"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onAddBusiness,
						className: "mt-4 rounded-card border border-line bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-bold tracking-wide text-gold",
								children: "ADD BUSINESS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Saves for all visitors. Offer shows on the listing."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-4 block text-xs font-medium text-muted",
								htmlFor: "category",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "category",
								value: category,
								onChange: (event) => setCategory(event.target.value),
								className: `${fieldClass} mt-2`,
								children: CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.id,
									children: item.label
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-3 block text-xs text-muted",
								htmlFor: "biz-name",
								children: "Business name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "biz-name",
								value: name,
								onChange: (event) => setName(event.target.value),
								className: `${fieldClass} mt-1`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-3 block text-xs text-muted",
								htmlFor: "biz-wa",
								children: "WhatsApp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "biz-wa",
								value: whatsapp,
								onChange: (event) => setWhatsapp(event.target.value),
								placeholder: "27…",
								inputMode: "tel",
								className: `${fieldClass} mt-1`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-3 block text-xs text-muted",
								htmlFor: "biz-offer",
								children: "Offer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "biz-offer",
								value: offer,
								onChange: (event) => setOffer(event.target.value),
								placeholder: "eg. 20% off haircuts",
								className: `${fieldClass} mt-1`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-3 block text-xs text-muted",
								htmlFor: "biz-area",
								children: "Address / area"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "biz-area",
								value: area,
								onChange: (event) => setArea(event.target.value),
								placeholder: "eg. Randburg",
								className: `${fieldClass} mt-1`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-3 block text-xs text-muted",
								htmlFor: "biz-message",
								children: "WhatsApp message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "biz-message",
								value: message,
								onChange: (event) => setMessage(event.target.value),
								placeholder: "Hi, I found you on Raymedia",
								className: `${fieldClass} mt-1`
							}),
							feedError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-gold",
								children: feedError
							}) : null,
							feedNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: feedNote
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: savingFeed,
								className: "mt-4 h-12 w-full rounded-xl bg-gold text-sm font-bold tracking-wide text-ink disabled:opacity-60",
								children: savingFeed ? "SAVING…" : "SAVE TO FEED — MAKE LIVE"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-wide text-muted",
							children: [
								"Saved (",
								listings.length,
								") · visible to everyone"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-col gap-2",
							children: listings.map((business) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-2xl border border-line bg-card px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-fg",
										children: business.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [categoryLabel(business.category), business.offer ? ` · ${business.offer}` : ""]
									}),
									pendingRemove === business.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => onRemove(business.id),
											className: "h-10 rounded-full bg-gold px-3 text-xs font-bold text-ink",
											children: "Remove"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setPendingRemove(null),
											className: "h-10 rounded-full px-3 text-xs text-muted",
											children: "Keep"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPendingRemove(business.id),
										className: "mt-1 h-10 text-xs text-muted",
										children: "Remove"
									})
								]
							}, business.id))
						})]
					})
				] }) : null
			]
		})
	});
	function updateSlide(index, patch) {
		setSlides((current) => current.map((slide, item) => item === index ? {
			...slide,
			...patch
		} : slide));
	}
}
function AdminPage() {
	const directory = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminScreen, { directory });
}
//#endregion
export { AdminPage as component };
