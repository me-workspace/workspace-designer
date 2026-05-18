# monis.rent — Workspace Designer

**Live (challenge build):** https://workspace-designer-eta.vercel.app/

Build your perfect Bali workspace and rent it. Pick desks, chairs, devices and
zones, set the scene, drag things into place — the studio updates live as you go.

> This is the **`platform`** branch — the project rebuilt from a single-screen
> coding-challenge demo into a real, flexible product. The original challenge
> submission is frozen on `main` (tag `challenge-submission`).

## What it does

- **Design a whole workspace**, not one desk — an environment, a team of desks,
  and zones around the room.
- **Rich catalog** — 9 desks, 7 chairs, 25 devices across 9 groups, 6 zones.
  Searchable, with collapsible categories.
- **Live studio preview** — a warm perspective scene. Pick a team size and the
  office fills with desks receding toward the horizon.
- **Environment editor** — room style, time of day (day / sunset / night),
  light warmth and brightness, plus quick scene presets.
- **Hybrid placement** — the app auto-arranges every item; drag any device or
  zone to fine-tune. Dragged items pin; "Auto-arrange" drops the pins.
- **Checkout & save** — itemised summary with per-workspace, team and zone
  costs; save and reload complete designs from local storage.

## Architecture

The whole platform is **data-driven**. Catalog items are plain objects carrying
a `spec`; a small set of generic renderers interpret those specs — so adding a
desk is one object, not one component.

```
src/model/types.ts        The WorkspaceDesign model — the contract
src/model/design.ts       Catalog lookups, pricing, edits, auto-layout
src/model/environment.ts  Resolves an EnvironmentConfig into scene colours
src/data/catalog.ts       The catalog — desks, chairs, devices, zones, presets
src/components/glyphs/    Generic spec renderers (Desk/Seating/Device/Zone)
src/components/           Canvas, selector, environment, packages, checkout
```

A user's design is one `WorkspaceDesign`: an `environment`, a list of
`stations` (desk + chair + devices), and `zones`. The canvas renders it; the
panels edit it. State is plain `useState` in the root page.

## Stack

- **Next.js 16** (App Router) · **React 19** · **Tailwind CSS v4**
- Pure HTML/CSS scene — no canvas, SVG only for the floor grid, zero render deps
- **Vercel** for deployment

## Running locally

```bash
npm install
npm run dev
```

## Built in 6 phases

1. Data-driven foundation — model, catalog, generic renderers
2. Rich catalog breadth — 40+ items, search, categories
3. Environment editor — room style, time of day, lighting
4. Zones — coffee corner, lounge, surf rack, and more
5. Hybrid drag-and-drop placement
6. Complex checkout & save/load

## What's next

- Distinct per-desk setups (unlink stations)
- Real product photography in place of the CSS scene
- Shareable URLs that encode a design
- A real checkout that emails the monis.rent team

---

*Originally a Desent Solutions developer challenge — May 2026.*
