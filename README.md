# monis.rent — Workspace Designer

**Live URL:** *(add after Vercel deployment)*

---

Build your perfect Bali office setup and rent it. Pick a desk, grab a chair, throw on some monitors and a plant — the workspace preview updates live as you go. Hit **Rent My Setup** when you're happy with it.

## Approach

Started by thinking about who's actually using this: someone who just landed in Bali and needs a workspace set up by next week. They don't want a product catalog, they want to feel like they're building something. So the whole thing is visual-first — the canvas is a hand-drawn SVG scene that updates as you select items, with the desk, chair, and accessories all rendered distinctly (wood grain, chair mesh patterns, lamp glow, etc.).

Kept the state simple — plain `useState` in the root page, no external store. The selector panel and canvas are just controlled components. Didn't want to add complexity that wasn't needed for this scope.

## Stack

- **Next.js 16** with App Router
- **Tailwind CSS v4**
- **Inline SVG** for the workspace scene — full control, zero extra deps
- **Vercel** for deployment

## Running locally

```bash
npm install
npm run dev
```

## Things I'd add with more time

- Drag-and-drop placement of accessories on the desk
- Real product photos from monis.rent instead of the SVG scene
- A shareable URL that encodes the current selection
- Actual checkout API that fires an email to the team
- Better mobile layout — probably a bottom-sheet approach

---

*Desent Solutions developer challenge — May 2026*
