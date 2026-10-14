import { o as __toESM } from "../_runtime.mjs";
import { a as whatsappHref, n as categoryLabel, t as CATEGORIES } from "./model-DodFDazk.mjs";
import { S as require_jsx_runtime, X as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RefreshCw, c as LayoutGrid, i as Search, l as GraduationCap, n as Sprout, o as Plus, r as ShoppingBag, s as Package, u as ChevronLeft } from "../_libs/lucide-react.mjs";
import { r as Route$1 } from "./router-DUa2sQRG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B12qEHQY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TikTokMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		className: "size-5 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M14.5 3c.4 2.4 1.7 4.1 4 4.6v2.4c-1.4 0-2.7-.4-4-1.2v6.5c0 3.4-2.6 5.9-6 5.9S2.5 18.7 2.5 15.3c0-3.3 2.5-5.8 5.8-5.9v2.5c-1.8.1-3.2 1.6-3.2 3.4 0 1.9 1.5 3.4 3.4 3.4s3.4-1.5 3.4-3.4V3h2.6Z"
		})
	});
}
function SearchGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
		className: "size-6",
		strokeWidth: 2.4,
		"aria-hidden": "true"
	});
}
var iconClass = "size-10 text-muted";
function CategoryGlyph({ id }) {
	if (id === "beauty" || id === "auto") return null;
	if (id === "health") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
		className: iconClass,
		strokeWidth: 2.4,
		"aria-hidden": "true"
	});
	if (id === "retail") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
		className: iconClass,
		strokeWidth: 1.8,
		"aria-hidden": "true"
	});
	if (id === "edu") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, {
		className: iconClass,
		strokeWidth: 1.8,
		"aria-hidden": "true"
	});
	if (id === "deals") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
		className: iconClass,
		strokeWidth: 1.8,
		"aria-hidden": "true"
	});
	if (id === "farm") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, {
		className: iconClass,
		strokeWidth: 1.8,
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, {
		className: iconClass,
		strokeWidth: 1.8,
		"aria-hidden": "true"
	});
}
function SponsorBanner({ slides, intervalSeconds }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [broken, setBroken] = (0, import_react.useState)({});
	const count = slides.length;
	const safeIndex = count === 0 ? 0 : index % count;
	const slide = slides[safeIndex];
	(0, import_react.useEffect)(() => {
		if (count < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setInterval(() => {
			setIndex((current) => (current + 1) % count);
		}, Math.max(2, intervalSeconds) * 1e3);
		return () => window.clearInterval(timer);
	}, [count, intervalSeconds]);
	if (!slide) return null;
	const image = slide.imageUrl && !broken[slide.id] ? slide.imageUrl : "";
	const open = () => {
		if (!slide.link) return;
		window.open(slide.link, "_blank", "noopener,noreferrer");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-5",
		"aria-roledescription": "carousel",
		"aria-label": "Sponsored",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: open,
			disabled: !slide.link,
			className: "w-full rounded-card border border-gold/80 bg-card px-4 py-4 text-left disabled:cursor-default",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "AD · Sponsored"
				}),
				image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "ray-swap mt-3 h-40 w-full rounded-2xl object-cover",
					onError: () => setBroken((current) => ({
						...current,
						[slide.id]: true
					}))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-start gap-3",
					children: [image ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-gold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
							className: "size-5",
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-base font-semibold leading-snug text-fg",
							children: slide.title
						}), slide.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm leading-snug text-muted",
							children: slide.subtitle
						}) : null]
					})]
				})
			]
		}), count > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex justify-center gap-2",
			role: "tablist",
			"aria-label": "Slides",
			children: slides.map((item, dot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": dot === safeIndex,
				"aria-label": `Slide ${dot + 1}`,
				onClick: () => setIndex(dot),
				className: `h-2 rounded-full ${dot === safeIndex ? "w-6 bg-gold" : "w-2 bg-line"}`
			}, item.id))
		}) : null]
	});
}
function HomeScreen({ directory, category }) {
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const needle = query.trim().toLowerCase();
	const active = CATEGORIES.find((item) => item.id === category);
	const visibleCategories = CATEGORIES.filter((item) => {
		if (item.home) return true;
		return directory.businesses.some((business) => business.category === item.id);
	});
	const matches = (0, import_react.useMemo)(() => {
		if (!needle) return [];
		return directory.businesses.filter((business) => {
			return [
				business.name,
				business.offer,
				business.area,
				business.message,
				categoryLabel(business.category)
			].join(" ").toLowerCase().includes(needle);
		});
	}, [directory.businesses, needle]);
	const inCategory = active ? directory.businesses.filter((business) => business.category === active.id) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-[440px] px-4 pb-28 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TikTokMark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl font-extrabold tracking-tight text-gold",
					children: "RAYMEDIA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-5 flex gap-2",
					onSubmit: (event) => {
						event.preventDefault();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "find",
							children: "Search local services"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "find",
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Search pizza, plumber, nails...",
							className: "h-14 min-w-0 flex-1 rounded-3xl border border-line bg-surface px-4 text-base text-fg outline-none placeholder:text-muted focus:border-gold"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "grid size-14 shrink-0 place-items-center rounded-2xl bg-gold text-ink",
							"aria-label": "Search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchGlyph, {})
						})
					]
				}),
				needle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-bold text-gold",
							children: "Results"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: matches.length === 0 ? "Nothing matches that yet." : `${matches.length} in Randburg`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessList, { businesses: matches })
					]
				}) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => navigate({
								to: "/",
								search: { cat: "" }
							}),
							className: "inline-flex h-11 items-center gap-1 text-sm font-medium text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "size-4",
								"aria-hidden": "true"
							}), "All categories"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl font-bold text-gold",
							children: active.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Randburg listings"
						}),
						inCategory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 rounded-card border border-line bg-card px-4 py-6 text-sm leading-relaxed text-muted",
							children: "Nothing listed here yet. New businesses show up after they are added in admin."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessList, { businesses: inCategory })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 font-display text-3xl font-bold leading-tight text-gold",
						children: "Find in Randburg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Choose a category to explore local services"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: visibleCategories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => navigate({
								to: "/",
								search: { cat: item.id }
							}),
							className: "flex min-h-28 flex-col items-center justify-center gap-3 rounded-card border border-gold/80 bg-card px-3 py-5 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryGlyph, { id: item.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-semibold leading-tight text-fg",
								children: item.label
							})]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SponsorBanner, {
						slides: directory.slides,
						intervalSeconds: directory.intervalSeconds
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-full max-w-[440px] justify-end p-4 pb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "pointer-events-auto inline-flex h-11 items-center rounded-full border border-line bg-surface/95 px-4 text-xs font-semibold tracking-[0.16em] text-muted",
					children: "ADMIN"
				})
			})
		})]
	});
}
function BusinessList({ businesses }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 flex flex-col gap-3",
		children: businesses.map((business) => {
			const href = whatsappHref(business.whatsapp, business.message);
			const visit = business.message.trim().startsWith("http") ? business.message.trim() : "";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-card border border-line bg-card px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-gold",
						children: categoryLabel(business.category)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 text-lg font-semibold text-fg",
						children: business.name
					}),
					business.offer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium text-gold",
						children: business.offer
					}) : null,
					business.area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: business.area
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex h-11 items-center rounded-full bg-gold px-4 text-sm font-semibold text-ink",
							children: "WhatsApp"
						}) : null, visit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: visit,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex h-11 items-center rounded-full border border-gold px-4 text-sm font-semibold text-gold",
							children: "Open offer"
						}) : null]
					})
				]
			}, business.id);
		})
	});
}
function Home() {
	const directory = Route$1.useLoaderData();
	const { cat } = Route$1.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {
		directory,
		category: cat
	});
}
//#endregion
export { Home as component };
