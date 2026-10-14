create table if not exists settings (
  id integer primary key,
  interval_seconds integer not null default 5,
  constraint settings_one check (id = 1)
);

create table if not exists slides (
  id serial primary key,
  sort_order integer not null default 0,
  image_url text not null default '',
  title text not null default '',
  subtitle text not null default '',
  link text not null default ''
);

create table if not exists businesses (
  id serial primary key,
  category text not null,
  name text not null,
  whatsapp text not null default '',
  offer text not null default '',
  area text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

insert into settings (id, interval_seconds)
values (1, 5)
on conflict (id) do nothing;

insert into slides (sort_order, image_url, title, subtitle, link)
select 0, '', 'Premium Banner — Your Business Here', 'rotating banner ad', ''
where not exists (select 1 from slides);

insert into slides (sort_order, image_url, title, subtitle, link)
select 1, '', 'Advertise in Randburg from R250/month', 'Tap to open WhatsApp', 'https://wa.me/27739422476'
where (select count(*) from slides) = 1;
