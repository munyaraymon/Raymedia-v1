import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import {
  isCategoryId,
  safeHttp,
  type Business,
  type Directory,
  type Slide,
} from "@/lib/raymedia/model";

const ADMIN_PIN = "ray1234";
const MAX_SLIDES = 8;
const MAX_BUSINESSES = 200;

type SlideRow = {
  id: number;
  sort_order: number;
  image_url: string;
  title: string;
  subtitle: string;
  link: string;
};

type BusinessRow = {
  id: number;
  category: string;
  name: string;
  whatsapp: string;
  offer: string;
  area: string;
  message: string;
};

function assertPin(pin: string) {
  if (pin !== ADMIN_PIN) throw new Error("Wrong password");
}

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

function mapSlide(row: SlideRow): Slide {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    imageUrl: row.image_url,
    title: row.title,
    subtitle: row.subtitle,
    link: row.link,
  };
}

function mapBusiness(row: BusinessRow): Business {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    whatsapp: row.whatsapp,
    offer: row.offer,
    area: row.area,
    message: row.message,
  };
}

const FALLBACK_DIRECTORY: Directory = {
  intervalSeconds: 5,
  slides: [
    {
      id: 1,
      sortOrder: 0,
      imageUrl: "",
      title: "Premium Banner — Your Business Here",
      subtitle: "rotating banner ad",
      link: "",
    },
    {
      id: 2,
      sortOrder: 1,
      imageUrl: "",
      title: "Advertise in Randburg from R250/month",
      subtitle: "Tap to open WhatsApp",
      link: "https://wa.me/27739422476",
    },
  ],
  businesses: [],
};

async function readDirectory(): Promise<Directory> {
  try {
    return await readDirectoryFromDb();
  } catch (error) {
    console.error("[raymedia] database unavailable, showing the public directory", error);
    return FALLBACK_DIRECTORY;
  }
}

async function readDirectoryFromDb(): Promise<Directory> {
  const sql = await getSql();
  const settings = await sql<{ interval_seconds: number }>`
    select interval_seconds from settings where id = 1
  `;
  const slides = await sql<SlideRow>`
    select id, sort_order, image_url, title, subtitle, link
    from slides
    order by sort_order asc, id asc
  `;
  const businesses = await sql<BusinessRow>`
    select id, category, name, whatsapp, offer, area, message
    from businesses
    order by id desc
  `;
  return {
    intervalSeconds: settings[0]?.interval_seconds ?? 5,
    slides: slides.map(mapSlide),
    businesses: businesses.map(mapBusiness),
  };
}

export const getDirectory = createServerFn({ method: "GET" }).handler(async () => {
  return readDirectory();
});

export const checkPin = createServerFn({ method: "POST" })
  .validator((input: { pin: string }) => input)
  .handler(async ({ data }) => {
    assertPin(data.pin);
    return { ok: true as const };
  });

type SlideInput = {
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
};

export const saveBanner = createServerFn({ method: "POST" })
  .validator((input: { pin: string; intervalSeconds: number; slides: SlideInput[] }) => input)
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const interval = Math.min(30, Math.max(2, Math.round(Number(data.intervalSeconds) || 5)));
    const slides = (Array.isArray(data.slides) ? data.slides : []).slice(0, MAX_SLIDES).map((slide) => ({
      imageUrl: safeHttp(clip(slide.imageUrl ?? "", 500)),
      title: clip(slide.title ?? "", 80),
      subtitle: clip(slide.subtitle ?? "", 140),
      link: safeHttp(clip(slide.link ?? "", 500)),
    }));
    if (slides.length === 0) throw new Error("Add at least one slide");
    if (slides.some((slide) => !slide.title)) throw new Error("Every slide needs a big title");

    const sql = await getSql();
    const orders = slides.map((_, index) => index);
    await sql.query(
      `with wiped as (delete from slides)
       insert into slides (sort_order, image_url, title, subtitle, link)
       select * from unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[])`,
      [
        orders,
        slides.map((slide) => slide.imageUrl),
        slides.map((slide) => slide.title),
        slides.map((slide) => slide.subtitle),
        slides.map((slide) => slide.link),
      ],
    );
    await sql.query(
      `insert into settings (id, interval_seconds) values (1, $1)
       on conflict (id) do update set interval_seconds = excluded.interval_seconds`,
      [interval],
    );
    return readDirectory();
  });

export const addBusiness = createServerFn({ method: "POST" })
  .validator(
    (input: {
      pin: string;
      category: string;
      name: string;
      whatsapp: string;
      offer: string;
      area: string;
      message: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    assertPin(data.pin);
    if (!isCategoryId(data.category)) throw new Error("Pick a category");
    const name = clip(data.name ?? "", 80);
    if (!name) throw new Error("Business name is required");
    const sql = await getSql();
    const count = await sql<{ n: number }>`select count(*)::int as n from businesses`;
    if ((count[0]?.n ?? 0) >= MAX_BUSINESSES) throw new Error("Listing limit reached");
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

export const removeBusiness = createServerFn({ method: "POST" })
  .validator((input: { pin: string; id: number }) => input)
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const id = Number(data.id);
    if (!Number.isInteger(id)) throw new Error("Missing listing");
    const sql = await getSql();
    await sql`delete from businesses where id = ${id}`;
    return readDirectory();
  });
