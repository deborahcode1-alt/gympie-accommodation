# Airbnb Host Site

A direct-booking website for an Airbnb host: a public listing page with an
availability calendar and booking-request form, plus an admin dashboard to
manage listings, review booking requests, and keep availability in sync with
Airbnb over iCal.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (swap the `DATABASE_URL` for Postgres/MySQL later without
  changing app code)
- `ical-generator` / `node-ical` for two-way calendar sync with Airbnb
- Cookie-based admin session (no third-party auth service)

## Getting started

```bash
npm install
cp .env.example .env   # then edit the values
npm run db:migrate
npm run db:seed
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` for the host dashboard (credentials come
from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`, applied by `db:seed`).

## Airbnb calendar sync

Each listing gets:

- **Export URL** (`/admin/listings/<id>/calendar`): paste this into Airbnb's
  "Import calendar" setting so direct bookings block the listing on Airbnb.
- **Import URL**: paste Airbnb's own export `.ics` URL here so bookings made
  on Airbnb block the listing on this site.

Syncing happens on demand (the "Sync all now" button) and whenever an import
URL is added. For hands-off syncing, hit `GET /api/cron/sync-ical?secret=<CRON_SECRET>`
on a schedule (Windows Task Scheduler locally, or a Vercel Cron / any HTTP
cron service once deployed).

## Booking flow

Guests submit a request from a listing page; nothing is charged automatically.
The host confirms or declines each request from `/admin`. There is no payment
processing wired up yet — add a provider (e.g. Stripe) before taking real
payments if you want to charge cards directly.

## Notes

- Photos are added by URL (host-hosted images, Imgur, etc.) — there's no file
  upload/storage wired up.
- Email notifications are not wired up; the admin dashboard is the source of
  truth for new requests until you add an email provider.
