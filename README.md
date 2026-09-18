# Bone Battle — Card Creator

A web app for creating custom "Bone Battle" pup-play collectible cards: fill in your pup persona, upload or AI-generate a portrait photo, preview the card live, and submit it for printing. Includes a Photoshop data export (TXT/CSV/JSON) and an optional Stripe tip jar.

Built with Next.js (App Router), React 19, TypeScript and Tailwind CSS.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with the following variables:
   - `RESEND_API_KEY` — [Resend](https://resend.com) API key for sending card submission emails
   - `APP_API_KEY` — Base44 API key used to sync submitted cards to the card database
   - `APP_API_BASE` — Base44 app base URL (e.g. `https://bonebattle.base44.app`)
   - `STRIPE_SECRET_KEY` — Stripe secret key for the tip-jar checkout
   - `GEMINI_API_KEY` — [Google AI Studio](https://aistudio.google.com/apikey) key for AI image generation
3. Run the app:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (with CSP nonce headers) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (`node --test`) |

## Architecture Notes

- **Security headers**: `proxy.ts` generates a per-request Content-Security-Policy nonce (see `lib/csp.mjs`, tested in `test/csp.test.mjs`).
- **AI generation** runs server-side only via `/api/generate`; the Gemini key never reaches the browser.
- **Card submission** is handled by `/api/send-card`: it emails the card data + attachments via Resend and syncs the card to the Base44 database.
- **Payments** are handled by `/api/create-checkout-session` (Stripe Checkout).
- Both API routes apply per-IP rate limiting (`lib/rateLimit.ts`) and validate input server-side.
