-- ─────────────────────────────────────────────────────────────────────────
-- Fuegos — schema de Supabase
--
-- Cómo usarlo:
-- 1. Crear un proyecto en https://supabase.com (plan gratuito alcanza).
-- 2. Ir a "SQL Editor" → "New query", pegar TODO este archivo y ejecutar.
-- 3. Ir a "Project Settings" → "API" y copiar "Project URL" y "anon public
--    key" a tu archivo .env.local (ver .env.example).
-- 4. Crear tu usuario admin: "Authentication" → "Users" → "Add user" (con
--    tu email y una contraseña). Ese es el único login del panel /admin.
--
-- Este script es seguro de re-ejecutar (usa IF NOT EXISTS / ON CONFLICT).
-- ─────────────────────────────────────────────────────────────────────────

-- ── Extensiones ─────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Categorías del menú ─────────────────────────────────────────────────
create table if not exists categories (
  id text primary key,
  label text not null,
  sort_order integer not null default 0
);

-- ── Productos del menú ──────────────────────────────────────────────────
create table if not exists products (
  id text primary key,
  category_id text not null references categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  price integer not null default 0,
  image_url text,
  tags text[] not null default '{}',
  ingredients text[] not null default '{}',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);

-- ── Contenido del sitio (fila única) ────────────────────────────────────
create table if not exists site_settings (
  id integer primary key default 1,
  name text not null default 'Fuegos',
  tagline text not null default '',
  short_description text not null default '',
  instagram_handle text not null default '',
  instagram_url text not null default '',
  whatsapp_number text not null default '',
  phone_display text not null default '',
  address_street text not null default '',
  address_city text not null default '',
  address_province text not null default '',
  address_postal_code text not null default '',
  address_country text not null default 'Argentina',
  hours_days text not null default '',
  hours_time text not null default '',
  closed_note text not null default '',
  schedule_open_days integer[] not null default '{}',
  schedule_opens text not null default '19:30',
  schedule_closes text not null default '23:30',
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

-- ── Zonas de delivery ────────────────────────────────────────────────────
create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cost integer not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0
);

-- ── Horarios de entrega ─────────────────────────────────────────────────
create table if not exists delivery_slots (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  active boolean not null default true,
  sort_order integer not null default 0
);

-- ── Pedidos ──────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'nuevo'
    check (status in ('nuevo', 'preparando', 'en_camino', 'entregado', 'cancelado')),
  customer_name text not null,
  customer_phone text,
  delivery_method text not null check (delivery_method in ('retiro', 'envio')),
  address text,
  delivery_zone_id uuid references delivery_zones(id) on delete set null,
  delivery_zone_name text,
  delivery_cost integer not null default 0,
  delivery_slot_id uuid references delivery_slots(id) on delete set null,
  delivery_slot_label text,
  payment_method text not null check (payment_method in ('efectivo', 'transferencia')),
  notes text not null default '',
  items jsonb not null default '[]',
  subtotal integer not null default 0,
  total integer not null default 0
);

create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists orders_status_idx on orders(status);

-- ── Row Level Security ──────────────────────────────────────────────────
-- El sitio público (clave "anon") puede LEER menú/contenido/delivery y
-- CREAR pedidos, pero no puede leer ni modificar pedidos existentes ni
-- escribir en el resto de las tablas. El panel admin usa un usuario
-- autenticado (Supabase Auth) que tiene permiso total.

alter table categories enable row level security;
alter table products enable row level security;
alter table site_settings enable row level security;
alter table delivery_zones enable row level security;
alter table delivery_slots enable row level security;
alter table orders enable row level security;

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);
drop policy if exists "admin write products" on products;
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read site_settings" on site_settings;
create policy "public read site_settings" on site_settings for select using (true);
drop policy if exists "admin write site_settings" on site_settings;
create policy "admin write site_settings" on site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read delivery_zones" on delivery_zones;
create policy "public read delivery_zones" on delivery_zones for select using (true);
drop policy if exists "admin write delivery_zones" on delivery_zones;
create policy "admin write delivery_zones" on delivery_zones for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read delivery_slots" on delivery_slots;
create policy "public read delivery_slots" on delivery_slots for select using (true);
drop policy if exists "admin write delivery_slots" on delivery_slots;
create policy "admin write delivery_slots" on delivery_slots for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public create orders" on orders;
create policy "public create orders" on orders for insert with check (true);
drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders for select
  using (auth.role() = 'authenticated');
drop policy if exists "admin update orders" on orders;
create policy "admin update orders" on orders for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "admin delete orders" on orders;
create policy "admin delete orders" on orders for delete
  using (auth.role() = 'authenticated');

-- ── Storage: fotos del menú ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

drop policy if exists "public read menu-images" on storage.objects;
create policy "public read menu-images" on storage.objects for select
  using (bucket_id = 'menu-images');

drop policy if exists "admin write menu-images" on storage.objects;
create policy "admin write menu-images" on storage.objects for all
  using (bucket_id = 'menu-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');

-- ── Seed: contenido actual del negocio ──────────────────────────────────
insert into site_settings (
  id, name, tagline, short_description, instagram_handle, instagram_url,
  whatsapp_number, phone_display, address_street, address_city,
  address_province, address_postal_code, address_country,
  hours_days, hours_time, closed_note,
  schedule_open_days, schedule_opens, schedule_closes
) values (
  1, 'Fuegos', 'Tu nuevo vicio', 'Burger, lomos y milas', '@fuegos.ceres',
  'https://www.instagram.com/fuegos.ceres', '5493491587727', '+54 9 3491 58-7727',
  'Bv. España 482', 'Ceres', 'Santa Fe', 'S2340', 'Argentina',
  'Miércoles a Domingo', '19:30 a 23:30', 'Lunes y martes cerrado',
  '{3,4,5,6,0}', '19:30', '23:30'
)
on conflict (id) do nothing;

-- ── Seed: categorías ─────────────────────────────────────────────────────
insert into categories (id, label, sort_order) values
  ('hamburguesas', 'Hamburguesas', 0),
  ('sandwiches', 'Sandwiches', 1),
  ('para-picar', 'Para picar', 2)
on conflict (id) do nothing;

-- ── Seed: productos ──────────────────────────────────────────────────────
insert into products (id, category_id, name, description, price, image_url, tags, ingredients, sort_order) values
  ('burger-clasica', 'hamburguesas', 'Clásica', 'Doble medallón smash, cheddar, cebolla y salsa de la casa.', 6500, '/images/menu/clasica.png', '{"más pedida"}', '{"Cheddar","Cebolla","Salsa de la casa"}', 0),
  ('burger-doble-cheddar', 'hamburguesas', 'Doble Cheddar', 'Doble medallón smash, doble cheddar y cebolla caramelizada.', 7200, '/images/menu/doble-cheddar.jpg.png', '{}', '{"Cheddar","Cebolla caramelizada"}', 1),
  ('burger-bacon-huevo', 'hamburguesas', 'Bacon & Huevo', 'Medallón smash, bacon crocante, huevo frito y cheddar.', 7800, '/images/menu/bacon-huevo.jpg.png', '{}', '{"Bacon","Huevo frito","Cheddar"}', 2),
  ('burger-crispy-onion', 'hamburguesas', 'Crispy Onion', 'Doble medallón, cheddar, bacon, cebolla crispy y salsa ahumada.', 7900, '/images/menu/crispy-onion.jpg.png', '{}', '{"Cheddar","Bacon","Cebolla crispy","Salsa ahumada"}', 3),
  ('burger-blue-cheese', 'hamburguesas', 'Blue Cheese', 'Medallón smash, salsa de queso azul, morrones asados y provolone.', 8200, '/images/menu/blue-cheese.png', '{"especial"}', '{"Salsa de queso azul","Morrones asados","Provolone"}', 4),
  ('burger-black', 'hamburguesas', 'Black Fuegos', 'Pan negro de carbón activado, doble medallón y cheddar fundido.', 8500, '/images/menu/black-fuegos.png', '{"especial"}', '{"Cheddar"}', 5),
  ('burger-smash-doble', 'hamburguesas', 'Smash Doble', 'Doble medallón smash bien marcado, queso cheddar derretido y pan brioche tostado.', 6700, '/images/menu/smash-tecnica.jpg.png', '{}', '{"Cheddar"}', 6),
  ('burger-onion-cheddar', 'hamburguesas', 'Onion Cheddar', 'Doble medallón smash, cebolla caramelizada y doble cheddar fundido.', 7100, '/images/menu/onion-cheddar.jpg.png', '{}', '{"Cheddar","Cebolla caramelizada"}', 7),
  ('burger-fresca', 'hamburguesas', 'Fresca', 'Medallón smash, lechuga, tomate y salsa de la casa.', 6600, '/images/menu/napolitana-style.jpg.png', '{}', '{"Lechuga","Tomate","Salsa de la casa"}', 8),
  ('lomito-clasico', 'sandwiches', 'Lomito Clásico', 'Lomito de cerdo, jamón, queso, lechuga y tomate.', 7000, null, '{}', '{"Jamón","Queso","Lechuga","Tomate"}', 0),
  ('lomito-completo', 'sandwiches', 'Lomito Completo', 'Lomito, jamón, queso, huevo, panceta, lechuga y tomate.', 8300, null, '{}', '{"Jamón","Queso","Huevo","Panceta","Lechuga","Tomate"}', 1),
  ('mila-napolitana', 'sandwiches', 'Milanesa Napolitana', 'Milanesa de carne, salsa, jamón y muzzarella gratinada.', 7500, null, '{}', '{"Salsa","Jamón","Muzzarella"}', 2),
  ('mila-caballo', 'sandwiches', 'Milanesa a Caballo', 'Milanesa de carne, huevos fritos, lechuga y tomate.', 7300, null, '{}', '{"Huevos fritos","Lechuga","Tomate"}', 3),
  ('nuggets', 'para-picar', 'Nuggets de Pollo', '10 unidades caseras con salsa a elección.', 5500, '/images/menu/nuggets.jpg.png', '{}', '{}', 0),
  ('bastones-muzzarella', 'para-picar', 'Bastones de Muzzarella', '8 unidades crocantes con salsa a elección.', 5200, null, '{}', '{}', 1),
  ('papas-fritas', 'para-picar', 'Papas Fritas', 'Porción grande, corte clásico.', 3800, null, '{}', '{}', 2),
  ('papas-cheddar-bacon', 'para-picar', 'Papas Cheddar & Bacon', 'Porción grande con cheddar fundido y bacon.', 5400, null, '{}', '{"Cheddar","Bacon"}', 3)
on conflict (id) do nothing;

-- ── Seed: zona y horario de delivery de ejemplo (editalos en el panel) ──
insert into delivery_zones (name, cost, active, sort_order) values
  ('Zona céntrica', 800, true, 0),
  ('Zona alejada', 1500, true, 1)
on conflict do nothing;

insert into delivery_slots (label, active, sort_order) values
  ('20:00 a 21:00', true, 0),
  ('21:00 a 22:00', true, 1),
  ('22:00 a 23:00', true, 2)
on conflict do nothing;
