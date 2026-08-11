# Business Challenge — delco

A phone-first PWA for Penta Summit: a 15-case business-decision simulation with a
hidden score (revealed only at the end), a tier badge, an end-of-quiz recap, a
leaderboard, and a hidden admin panel — built with Next.js, Tailwind, and Framer Motion.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in ADMIN_PASSWORD + ADMIN_SESSION_SECRET
npm run dev
```

Open http://localhost:3000. `/challenge` is the quiz, `/leaderboard` is public,
`/admin` is password-gated.

## The experience

1. **Home (`/`)** — splash screen: logo, "Business Challenge", tagline, tap anywhere to
   continue. This is where the printed QR code lands, so it doubles as the brand moment.
   On desktop/tablet it also renders its own QR for anyone watching over a shoulder.
2. **Cover (`/challenge`, first screen)** — case count, time estimate, "Start Challenge".
3. **Cases** — one full-screen case at a time: section badge (e.g. 🚀 BUILD A BUSINESS),
   case title, a short scenario, the question, and options. Selecting an option advances
   immediately to the next case — **no correct/incorrect feedback is shown yet**, on
   purpose (keeps the suspense until the end; see below).
4. **Result** — animated score reveal + a tier badge (Boardroom Master / Deal Maker /
   Business Builder / Future Founder / Getting Started, see `src/lib/tiers.ts`).
5. **Recap** — every case, your answer, the correct answer, and the explanation — this is
   where the "what you should know" legal content actually gets read.
6. **Join Leaderboard** — name / company / email, styled as an app step, not a form.
   Submitting also emails the player their score, tier, and full case-by-case recap
   (best-effort — see Email below).

A run in progress is saved to `localStorage` (`src/lib/progress.ts`) and resumed on
reload, since phones drop backgrounded tabs. Saved runs expire after 2h and are
discarded if the case set changed underneath them.

## Event setup

- **Signage** — the QR on the table tents points at the production root URL. Regenerate
  the print assets with `QR_URL=<url> node scripts/generate-qr.mjs` (writes PNGs plus an
  SVG to `qr/`, which is gitignored — they're build output, not source).
- **Booth screen (`/display`)** — a leaderboard built to be read from across the room:
  viewport-scaled type, 6s auto-refresh, animated rank changes, and a join QR on screen.
  Open it fullscreen (F11) on whatever drives the TV — a laptop over HDMI, a smart TV's
  own browser, or a cast stick. It never needs interaction once loaded.

## Environment variables

See `.env.example`. Required:

- `ADMIN_PASSWORD` — password to unlock `/admin`.
- `ADMIN_SESSION_SECRET` — signs the admin session cookie (`openssl rand -base64 32`).

Optional (**required before deploying to Vercel** — see below):

- `KV_REST_API_URL` / `KV_REST_API_TOKEN` — Vercel KV / Upstash Redis REST credentials.

Optional (results email):

- `RESEND_API_KEY` — from resend.com. Unset = email sending is skipped silently.
- `RESEND_FROM_EMAIL` — defaults to `info@delcolaw.com` (domain must be verified in Resend).
- `NEXT_PUBLIC_SITE_URL` — used for the logo image and leaderboard link inside the email.

## Data storage

Questions and leaderboard entries live behind `src/lib/store.ts`:

- **No KV configured** (default, local dev): falls back to a JSON file at `.data/db.json`
  (gitignored). Fine for `npm run dev`, but Vercel's serverless functions don't have a
  writable persistent filesystem — this path won't survive between requests in production.
- **KV configured**: reads/writes go to Vercel KV (Upstash Redis) via plain `fetch` calls
  (no SDK dependency). Add the Vercel KV integration to your project, copy its
  `KV_REST_API_URL` / `KV_REST_API_TOKEN` into your environment, and redeploy.

**Before the event, add Vercel KV (or point these env vars at an Upstash Redis
database) so leaderboard entries actually persist.**

## Editing the 15 cases

The real cases ship in `src/data/questions.default.ts` — edit them from the Admin panel
(`/admin` → Questions tab) instead: each case has an emoji + section, case title,
scenario, question, options, correct answer, and an explanation (shown in the recap, not
during play). No redeploy needed; changes write straight to the store above.

Score tiers assume 15 questions total (see the ratio thresholds in `src/lib/tiers.ts`) —
update those if the case count changes materially.

## Brand assets

`src/components/Logo.tsx` and `public/logo/*.svg` hold the real delco wordmark, extracted
as vector paths from the official brand files (Pantone 287 C / `#002F87`). See
`public/logo/README.md` for details and how to regenerate the PWA icons if the mark ever
changes.

## Email results

`src/lib/email.ts` sends a results email via [Resend](https://resend.com) when someone
joins the leaderboard (`src/app/api/submit/route.ts`) — score, tier badge, and the same
case-by-case recap shown on screen. It's best-effort: a failed send is logged but never
blocks the leaderboard join. Without `RESEND_API_KEY` set, sending is skipped entirely
(no error). The `from` address requires the sending domain to be verified in Resend
(Dashboard → Domains → add the DNS records it gives you).

## Kiosk mode (iPad)

- Add the site to the Home Screen (Safari → Share → Add to Home Screen) for a
  standalone, fullscreen PWA with no browser chrome.
- The app auto-resets to the home screen after 90s of inactivity on any screen except
  `/admin` (see `src/components/KioskIdleReset.tsx`) — so it's ready for the next
  attendee if someone walks away mid-challenge.

## Deploying

Standard Vercel deploy (`vercel deploy` or connect the repo). Set the environment
variables above in the Vercel project settings first — especially the KV credentials,
without which leaderboard submissions won't persist in production.
