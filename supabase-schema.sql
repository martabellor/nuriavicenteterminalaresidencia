create table if not exists public.signups (
  id bigint generated always as identity primary key,
  name text not null,
  menu_choice text not null check (menu_choice in ('pescado', 'carne')),
  allergies text not null default 'ninguna',
  created_at timestamptz not null default now()
);
