# Working Holiday Hub

A mobile-first site for working holiday visas and seasonal jobs. This MVP launches with **Japan** (Niseko, Hakuba, Tokyo, Kyoto, Okinawa) for the 2026–27 winter, plus South Korea for US passports.

Visa numbers come from official pages. Anything we have not confirmed is stored as `null` with a `TODO verify` note. This is information only, not immigration advice.

## What is in this build

- Eligibility matcher on the home page
- Static `/japan` hub page and `/[destination]/[passport]` SEO pages (FAQ + JSON-LD)
- `sitemap.xml` and `robots.txt`
- Mock magic-link profile (no Supabase)
- Employer interest form
- Curated jobs and Express interest (no Resend — emails are mocked)

## Run locally

Need Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev -- --port 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

### What to check

1. Home matcher: United Kingdom, age 24, start `2026-11`, interests `ski/snow` → Japan with Niseko and Hakuba.
2. Same form with United States → Japan marked not eligible, South Korea listed.
3. Open `/japan/uk-citizens` and `/japan` .
4. `/jobs` → open a listing → Profile → mock magic link → Express interest.
5. `/admin/jobs` mock secret: `local-dev-admin`.

```bash
npm run lint
npm run build
```

## Data

- `data/eligibility.json` — destination × passport facts and official URLs
- `data/hubs.json` — Japan hubs, seasons, typical jobs
- `data/jobs.json` — verified employers only; no commission-only roles

## Deploy

Vercel later. Point production env vars at real Supabase and Resend when you are ready; the app runs without them.
