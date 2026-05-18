# monis.rent — Workspace Designer

> An interactive workspace configurator for digital nomads in Bali.

**Live URL:** *(add Vercel URL after deployment)*

---

## What it does

Pick a desk, choose a chair, stack on monitors, add a lamp and a plant — and watch your office come to life in real time. When you're happy with it, hit **Rent My Setup** and monis.rent handles the rest: delivery anywhere in Bali, monthly swaps, no commitment.

---

## Approach

I started from the user's perspective: a freelancer landing in Bali who wants to feel excited about their setup, not scroll a spreadsheet. The experience is visual-first — the workspace canvas updates instantly as you build, showing a detailed SVG scene with your desk, chair, monitors, lamp, and plants exactly as composed.

**Layout:** two-column — selector panel on the left, live workspace preview on the right. The preview is a hand-crafted SVG scene with realistic desk grain, wood edge, chair styles (mesh / leather / ergonomic with distinct shapes), monitor screens with pseudo-code content, lamp glow effects, and tropical plants. Items animate in with a spring entrance.

**State:** plain React `useState` — no external store needed for this scope.

---

## Tech choices

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16 (App Router)** | Required; fast static output, easy Vercel deploys |
| Styling | **Tailwind CSS v4** | Required; utility-first, styles co-located with components |
| Visualization | **Inline SVG** | Full control over the workspace scene, no extra dependency |
| Fonts | **Inter** (Google Fonts) | Clean, neutral, pairs with warm-toned UI |
| Deployment | **Vercel** | One-command deploy, zero config for Next.js |

No animation library, no state manager, no component kit — minimal dependencies keep the code readable.

---

## What I'd improve with more time

- **Drag-and-drop accessories** — let users place items anywhere on the desk rather than fixed positions
- **Real product photos** — swap SVG scene for a layered image compositor using actual monis.rent photos
- **3D / isometric view** — a React Three Fiber scene would make the preview much more immersive
- **Weekly vs monthly pricing** — toggle between rental periods with bundle discounts
- **Shareable URL** — encode the workspace selection in the URL so it can be bookmarked or shared
- **Real checkout API** — `/api/rent` route that emails both the user and monis.rent on submission
- **Mobile-native layout** — a bottom-sheet tab-based flow optimised for touch

---

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploying

```bash
# push to GitHub, then connect repo to Vercel
vercel --prod
```

---

*Built for the Desent Solutions developer challenge · May 2026*
