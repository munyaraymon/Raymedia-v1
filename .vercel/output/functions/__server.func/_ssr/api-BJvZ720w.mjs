import { i as safeHttp, r as isCategoryId } from "./model-DodFDazk.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BJvZ720w.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_raymedia_default = "create table if not exists settings (\n  id integer primary key,\n  interval_seconds integer not null default 5,\n  constraint settings_one check (id = 1)\n);\n\ncreate table if not exists slides (\n  id serial primary key,\n  sort_order integer not null default 0,\n  image_url text not null default '',\n  title text not null default '',\n  subtitle text not null default '',\n  link text not null default ''\n);\n\ncreate table if not exists businesses (\n  id serial primary key,\n  category text not null,\n  name text not null,\n  whatsapp text not null default '',\n  offer text not null default '',\n  area text not null default '',\n  message text not null default '',\n  created_at timestamptz not null default now()\n);\n\ninsert into settings (id, interval_seconds)\nvalues (1, 5)\non conflict (id) do nothing;\n\ninsert into slides (sort_order, image_url, title, subtitle, link)\nselect 0, '', 'Premium Banner — Your Business Here', 'rotating banner ad', ''\nwhere not exists (select 1 from slides);\n\ninsert into slides (sort_order, image_url, title, subtitle, link)\nselect 1, '', 'Advertise in Randburg from R250/month', 'Tap to open WhatsApp', 'https://wa.me/27739422476'\nwhere (select count(*) from slides) = 1;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_raymedia.sql": _0002_raymedia_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var ADMIN_PIN = "ray1234";
var MAX_SLIDES = 8;
var MAX_BUSINESSES = 200;
function assertPin(pin) {
	if (pin !== ADMIN_PIN) throw new Error("Wrong password");
}
function clip(value, max) {
	return value.trim().slice(0, max);
}
function mapSlide(row) {
	return {
		id: row.id,
		sortOrder: row.sort_order,
		imageUrl: row.image_url,
		title: row.title,
		subtitle: row.subtitle,
		link: row.link
	};
}
function mapBusiness(row) {
	return {
		id: row.id,
		category: row.category,
		name: row.name,
		whatsapp: row.whatsapp,
		offer: row.offer,
		area: row.area,
		message: row.message
	};
}
async function readDirectory() {
	const sql = await getSql();
	const settings = await sql`
    select interval_seconds from settings where id = 1
  `;
	const slides = await sql`
    select id, sort_order, image_url, title, subtitle, link
    from slides
    order by sort_order asc, id asc
  `;
	const businesses = await sql`
    select id, category, name, whatsapp, offer, area, message
    from businesses
    order by id desc
  `;
	return {
		intervalSeconds: settings[0]?.interval_seconds ?? 5,
		slides: slides.map(mapSlide),
		businesses: businesses.map(mapBusiness)
	};
}
var getDirectory_createServerFn_handler = createServerRpc({
	id: "813b606ae5d8853d583edc8d5d7854a8eae0c16388a172439e42540189ce516f",
	name: "getDirectory",
	filename: "src/lib/raymedia/api.ts"
}, (opts) => getDirectory.__executeServer(opts));
var getDirectory = createServerFn({ method: "GET" }).handler(getDirectory_createServerFn_handler, async () => {
	return readDirectory();
});
var checkPin_createServerFn_handler = createServerRpc({
	id: "f80f88a2c640e0b743214364fe65e0505b7559704cf7141e6e8cea8aa1d8dde5",
	name: "checkPin",
	filename: "src/lib/raymedia/api.ts"
}, (opts) => checkPin.__executeServer(opts));
var checkPin = createServerFn({ method: "POST" }).validator((input) => input).handler(checkPin_createServerFn_handler, async ({ data }) => {
	assertPin(data.pin);
	return { ok: true };
});
var saveBanner_createServerFn_handler = createServerRpc({
	id: "2b9ba2bcc84d165c3339e411b68b5cac5f15de067887be75570221cee05335e6",
	name: "saveBanner",
	filename: "src/lib/raymedia/api.ts"
}, (opts) => saveBanner.__executeServer(opts));
var saveBanner = createServerFn({ method: "POST" }).validator((input) => input).handler(saveBanner_createServerFn_handler, async ({ data }) => {
	assertPin(data.pin);
	const interval = Math.min(30, Math.max(2, Math.round(Number(data.intervalSeconds) || 5)));
	const slides = (Array.isArray(data.slides) ? data.slides : []).slice(0, MAX_SLIDES).map((slide) => ({
		imageUrl: safeHttp(clip(slide.imageUrl ?? "", 500)),
		title: clip(slide.title ?? "", 80),
		subtitle: clip(slide.subtitle ?? "", 140),
		link: safeHttp(clip(slide.link ?? "", 500))
	}));
	if (slides.length === 0) throw new Error("Add at least one slide");
	if (slides.some((slide) => !slide.title)) throw new Error("Every slide needs a big title");
	const sql = await getSql();
	const orders = slides.map((_, index) => index);
	await sql.query(`with wiped as (delete from slides)
       insert into slides (sort_order, image_url, title, subtitle, link)
       select * from unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[])`, [
		orders,
		slides.map((slide) => slide.imageUrl),
		slides.map((slide) => slide.title),
		slides.map((slide) => slide.subtitle),
		slides.map((slide) => slide.link)
	]);
	await sql.query(`insert into settings (id, interval_seconds) values (1, $1)
       on conflict (id) do update set interval_seconds = excluded.interval_seconds`, [interval]);
	return readDirectory();
});
var addBusiness_createServerFn_handler = createServerRpc({
	id: "b5323b41e52635d3b406f44a186a29c1808df58dd6c2dd8ac181edf504e51cfd",
	name: "addBusiness",
	filename: "src/lib/raymedia/api.ts"
}, (opts) => addBusiness.__executeServer(opts));
var addBusiness = createServerFn({ method: "POST" }).validator((input) => input).handler(addBusiness_createServerFn_handler, async ({ data }) => {
	assertPin(data.pin);
	if (!isCategoryId(data.category)) throw new Error("Pick a category");
	const name = clip(data.name ?? "", 80);
	if (!name) throw new Error("Business name is required");
	const sql = await getSql();
	if (((await sql`select count(*)::int as n from businesses`)[0]?.n ?? 0) >= MAX_BUSINESSES) throw new Error("Listing limit reached");
	await sql`
      insert into businesses (category, name, whatsapp, offer, area, message)
      values (
        ${data.category},
        ${name},
        ${clip(data.whatsapp ?? "", 40)},
        ${clip(data.offer ?? "", 120)},
        ${clip(data.area ?? "", 80)},
        ${clip(data.message ?? "", 300)}
      )
    `;
	return readDirectory();
});
var removeBusiness_createServerFn_handler = createServerRpc({
	id: "059dcecf4545fd24e38f368ffced9c5355c315cadf30bbe38eccad55e7b1fd06",
	name: "removeBusiness",
	filename: "src/lib/raymedia/api.ts"
}, (opts) => removeBusiness.__executeServer(opts));
var removeBusiness = createServerFn({ method: "POST" }).validator((input) => input).handler(removeBusiness_createServerFn_handler, async ({ data }) => {
	assertPin(data.pin);
	const id = Number(data.id);
	if (!Number.isInteger(id)) throw new Error("Missing listing");
	await (await getSql())`delete from businesses where id = ${id}`;
	return readDirectory();
});
//#endregion
export { addBusiness_createServerFn_handler, checkPin_createServerFn_handler, getDirectory_createServerFn_handler, removeBusiness_createServerFn_handler, saveBanner_createServerFn_handler };
