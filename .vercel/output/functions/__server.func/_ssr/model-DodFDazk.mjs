//#region node_modules/.nitro/vite/services/ssr/assets/model-DodFDazk.js
var CATEGORIES = [
	{
		id: "beauty",
		label: "Beauty & Care",
		home: true
	},
	{
		id: "auto",
		label: "Auto & Repair",
		home: true
	},
	{
		id: "health",
		label: "Health",
		home: true
	},
	{
		id: "retail",
		label: "Shopping & Retail",
		home: true
	},
	{
		id: "edu",
		label: "Education & Kids",
		home: true
	},
	{
		id: "deals",
		label: "Deals from Amazon",
		home: true
	},
	{
		id: "farm",
		label: "Farm Services",
		home: false
	},
	{
		id: "other",
		label: "Other",
		home: false
	}
];
function categoryLabel(id) {
	return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}
function isCategoryId(value) {
	return CATEGORIES.some((category) => category.id === value);
}
function whatsappHref(raw, message) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(trimmed)) return trimmed;
	const digits = trimmed.replace(/\D/g, "");
	if (digits.length < 8) return null;
	const text = message.trim();
	const base = `https://wa.me/${digits}`;
	return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
function safeHttp(value) {
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
//#endregion
export { whatsappHref as a, safeHttp as i, categoryLabel as n, isCategoryId as r, CATEGORIES as t };
