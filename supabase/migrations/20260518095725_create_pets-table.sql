-- ENUMS
create type pet_species as enum (
  'dog',
  'cat',
  'bird',
  'fish',
  'rodent',
  'ferret',
  'rabbit',
  'reptile',
  'horse',
  'other'
);

create type pet_sex as enum ('male', 'female');

create type pet_listing_type as enum ('lost', 'found', 'adoption', 'sale');

create type pet_status as enum ('active', 'closed');

-- TABLE
create table pets (
  id uuid primary key default gen_random_uuid(),

  -- Владелец объявления (любой профиль: user, shelter, admin)
  owner_id uuid not null references profiles(id) on delete cascade,

  -- Основная информация
  name text,
  species pet_species not null,
  breed text,
  sex pet_sex,

  -- Возраст только в месяцах
  age_months integer not null,

  description text,
  image_url text,

  -- Тип объявления
  listing_type pet_listing_type not null,

  -- Цена (только для sale)
  price numeric(10,2),

  -- Медицинская информация
  is_vaccinated boolean default false,
  is_sterilized boolean default false,
  is_special_needs boolean default false,

  -- Локация
  city text,
  address text,

  -- Статус объявления
  status pet_status not null default 'active',

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table pets enable row level security;

create policy "Owner can view own pets"
on pets for select
using (auth.uid() = owner_id);

create policy "Owner can insert pets"
on pets for insert
with check (auth.uid() = owner_id);

create policy "Owner can update own pets"
on pets for update
using (auth.uid() = owner_id);

create policy "Owner can delete own pets"
on pets for delete
using (auth.uid() = owner_id);
