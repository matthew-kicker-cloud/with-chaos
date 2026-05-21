# with-chaos

Minimal single-event invite + RSVP app built with:

- Next.js App Router
- TypeScript
- MUI
- Supabase
- Vercel-ready deployment

## Features

- Guest-specific invite links: `/{slug}`
- Two config-driven modes:
  - `save_the_date`
  - `rsvp_open`
- RSVP updates through same invite link
- Simple password-protected admin page: `/admin`
- Guest CRUD + totals + CSV export
- Per-guest photo gallery on invite page (slug-specific)
- Contact detail collection (save-the-date mode)
- Calendar support:
  - Google Calendar link
  - Downloadable `.ics` via `/api/calendar/ics?slug=...`

## Project structure

```text
app/
  [slug]/
  admin/
  api/
components/
lib/
supabase/
```

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL` (for invite links and calendar URLs)

Important: never expose `SUPABASE_SECRET_KEY` to the client.

## Supabase setup

Run SQL in your Supabase SQL editor in this order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Or run from terminal:

```bash
yarn seed
```

For `yarn seed`, set one of:

- `SUPABASE_ACCESS_TOKEN` (Supabase personal access token)

## App mode and event details

Edit `lib/config.ts`:

- `mode`: `"save_the_date"` or `"rsvp_open"`
- Event title/date/location/details

## Per-guest photos

- Store invite photos in `public/assets/photos/`
- Each guest row has `photo_filenames` (text array in Supabase)
- Admin add/edit accepts photo filenames as comma or newline separated text
- Example values:
  - `mum-dad-1.jpg`
  - `mum-dad-2.jpg`
  - `mum-dad-3.jpg`

The invite page resolves each filename to:

- `/assets/photos/<filename>`

## Local development

```bash
npm install
npm run dev
```

Open:

- Guest link example: `http://localhost:3000/mum-and-dad-x7k2`
- Admin: `http://localhost:3000/admin`

## Deploy to Vercel

1. Push repo to Git provider.
2. Import project in Vercel.
3. Set the same environment variables in Vercel project settings.
4. Deploy.

## API endpoints

- `POST /api/rsvp`
- `POST /api/contact-details`
- `GET /api/calendar/ics?slug=...`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `POST /api/admin/guests`
- `PATCH /api/admin/guests/:id`
- `DELETE /api/admin/guests/:id`
- `GET /api/admin/guests.csv`
