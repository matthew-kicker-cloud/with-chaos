create extension if not exists "pgcrypto";

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_name text not null,
  greeting text,
  max_party_size int not null default 1 check (max_party_size >= 1),
  photo_filenames text[] not null default '{}',
  invite_sent boolean not null default false,
  email text,
  phone text,
  mailing_address text,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'attending', 'not_attending')),
  attending_count int not null default 0 check (attending_count >= 0),
  dietary_notes text,
  song_request text,
  message text,
  save_the_date_seen_at timestamptz,
  declined_at_save_the_date boolean not null default false,
  contact_details_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guests
add column if not exists photo_filenames text[] not null default '{}';

alter table public.guests
add column if not exists invite_sent boolean not null default false;

alter table public.guests
add column if not exists declined_at_save_the_date boolean not null default false;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on public.guests;
create trigger guests_set_updated_at
before update on public.guests
for each row
execute function public.set_updated_at();
